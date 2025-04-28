import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModelLoader from "../components/ModelLoader";

function WelcomePage() {
  const navigate = useNavigate();
  const [isModelLoading, setIsModelLoading] = useState(true);

  const handleStartClick = () => {
    navigate("/input"); // Navigate to the Spell Input page
  };

  const handleModelReady = () => {
    setIsModelLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isModelLoading && <ModelLoader onModelReady={handleModelReady} />}
      </AnimatePresence>

      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-8 text-center drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          SpellyQuest
        </motion.h1>

        {/* Placeholder for Logo */}
        <motion.div
          className="w-32 h-32 bg-yellow-300 rounded-full flex items-center justify-center mb-12 shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: "spring",
            stiffness: 100,
          }}
        >
          <span className="text-6xl">✨</span> {/* Example placeholder icon */}
        </motion.div>

        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartClick}
          disabled={isModelLoading}
        >
          Start Adventure!
        </motion.button>
      </motion.div>
    </>
  );
}

export default WelcomePage;
