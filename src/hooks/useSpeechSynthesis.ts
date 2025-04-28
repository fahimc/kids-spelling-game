import { useEffect, useState, useRef } from "react";
import { pipeline, env } from "@xenova/transformers";

// Set to use local storage for models
env.cacheDir = "./model-cache";

// We'll use a lightweight TTS model
const TTS_MODEL = "Xenova/speecht5_tts";

const useTransformerTTS = () => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ttsRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        });

        // Initialize audio element
        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.onended = () => setIsSpeaking(false);
        }

        setIsModelReady(true);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Error loading TTS model:", err);
        setError(
          `Failed to load TTS model: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setIsModelLoading(false);
      }
    };

    loadModel();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const speak = async (text: string) => {
    if (!isModelReady || !ttsRef.current || isSpeaking) {
      return;
    }

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
    }
  };

  const cancel = () => {
    if (audioRef.current && isSpeaking) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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
  };
};

export default useTransformerTTS;
