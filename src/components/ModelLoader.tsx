import React from "react";
import { motion } from "framer-motion";
import useTransformerTTS from "../hooks/useTransformerTTS";

interface ModelLoaderProps {
  onModelReady: () => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ onModelReady }) => {
  const {
    isModelLoading,
    isModelReady,
    loadingProgress,
    error,
    usingBrowserTTS,
  } = useTransformerTTS();

  React.useEffect(() => {
    if (isModelReady) {
      onModelReady();
    }
  }, [isModelReady, onModelReady]);

  // Calculate proper progress bar color based on state
  const progressBarColor = error
    ? usingBrowserTTS
      ? "bg-yellow-500"
      : "bg-red-500"
    : "bg-green-500";

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Loading SpellyQuest
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            {isModelLoading
              ? "Loading speech model..."
              : error
              ? usingBrowserTTS
                ? "Using browser's speech synthesis"
                : "Error loading model"
              : "Speech model loaded!"}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <motion.div
              className={`${progressBarColor} h-4 rounded-full`}
              initial={{ width: "0%" }}
              animate={{
                width: usingBrowserTTS ? "100%" : `${loadingProgress}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-sm text-gray-500">
            {usingBrowserTTS
              ? "Ready to begin"
              : `${loadingProgress}% complete`}
          </p>
        </div>

        {error && (
          <motion.div
            className={`mb-4 p-3 ${
              usingBrowserTTS
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            } rounded-lg`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
            {usingBrowserTTS && (
              <p className="mt-2 font-medium">
                Successfully switched to browser's speech synthesis.
              </p>
            )}
          </motion.div>
        )}

        <p className="text-gray-700 text-sm italic">
          {usingBrowserTTS
            ? "Using your browser's built-in text-to-speech capabilities."
            : "This will only happen the first time you use the app as models are cached locally."}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ModelLoader;
