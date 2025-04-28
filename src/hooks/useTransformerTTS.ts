import { useEffect, useState, useRef } from "react";
import { pipeline, env } from "@xenova/transformers";

// Set to use local storage for models
env.cacheDir = "./model-cache";

// We'll use a lightweight TTS model
const TTS_MODEL = "Xenova/speecht5_tts";

// Maximum number of retries for model loading
const MAX_RETRIES = 2;

const useTransformerTTS = () => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [usingBrowserTTS, setUsingBrowserTTS] = useState(false);

  const ttsRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCount = useRef(0);
  const synth = useRef<SpeechSynthesis | null>(null);
  const voices = useRef<SpeechSynthesisVoice[]>([]);

  // Initialize browser's SpeechSynthesis as fallback
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;

      const updateVoices = () => {
        voices.current = synth.current?.getVoices() || [];
      };

      // Get voices initially and when they change
      updateVoices();
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  // Initialize the TTS model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        setError(null);

        // Create progress callback
        const onProgress = (progress: {
          status: string;
          progress?: number;
        }) => {
          if (progress.progress) {
            setLoadingProgress(Math.round(progress.progress * 100));
          }
        };

        // Load the TTS pipeline with progress tracking
        ttsRef.current = await pipeline("text-to-speech", TTS_MODEL, {
          progress_callback: onProgress,
          cache_implementation: {
            // Use sessionStorage to avoid persistent caching issues
            get: (key: string) => sessionStorage.getItem(key),
            set: (key: string, value: string) =>
              sessionStorage.setItem(key, value),
            delete: (key: string) => sessionStorage.removeItem(key),
            keys: () => Object.keys(sessionStorage),
          },
        });

        // Initialize audio element
        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.onended = () => setIsSpeaking(false);
        }

        setIsModelReady(true);
        setIsModelLoading(false);
        setUsingBrowserTTS(false);
      } catch (err) {
        console.error("Error loading TTS model:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load TTS model: ${errorMessage}`);

        // Retry logic
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.log(
            `Retrying model load (attempt ${retryCount.current} of ${MAX_RETRIES})...`
          );
          setTimeout(loadModel, 1000); // Wait 1 second before retry
          return;
        }

        // After max retries, fall back to browser TTS
        console.log("Falling back to browser speech synthesis");
        setIsModelReady(true); // Consider the system "ready" using browser TTS
        setIsModelLoading(false);
        setUsingBrowserTTS(true);
      }
    };

    loadModel();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      // Cancel any browser TTS that might be speaking
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const speak = async (text: string) => {
    if (!isModelReady || isSpeaking) {
      return;
    }

    // If we're using browser TTS
    if (usingBrowserTTS) {
      if (!synth.current) return;

      setIsSpeaking(true);
      synth.current.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);

      // Select a voice (preferably a female voice for consistency with the model)
      if (voices.current.length > 0) {
        // Try to find a female voice
        const femaleVoice = voices.current.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("woman") ||
            v.name.toLowerCase().includes("girl")
        );

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Browser TTS error:", event);
        setIsSpeaking(false);
      };

      synth.current.speak(utterance);
      return;
    }

    // If we're using transformer TTS
    try {
      setIsSpeaking(true);

      // Generate speech
      const result = await ttsRef.current(text, {
        voice_preset: "female", // You can adjust this or make it configurable
      });

      // Convert array buffer to blob
      const blob = new Blob([result.audio], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }

      // Clean up the URL when done
      audioRef.current?.addEventListener(
        "ended",
        () => {
          URL.revokeObjectURL(url);
          setIsSpeaking(false);
        },
        { once: true }
      );
    } catch (err) {
      console.error("TTS generation error:", err);
      setIsSpeaking(false);
      setError(
        `Failed to generate speech: ${
          err instanceof Error ? err.message : String(err)
        }`
      );

      // If transformer TTS fails, try browser TTS as a backup
      if (!usingBrowserTTS && synth.current) {
        console.log("Fallback to browser TTS for this utterance");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        synth.current.speak(utterance);
      }
    }
  };

  const cancel = () => {
    if (audioRef.current && isSpeaking && !usingBrowserTTS) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }

    if (synth.current && usingBrowserTTS) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    cancel,
    isSpeaking,
    isModelLoading,
    isModelReady,
    loadingProgress,
    error,
    usingBrowserTTS,
  };
};

export default useTransformerTTS;
