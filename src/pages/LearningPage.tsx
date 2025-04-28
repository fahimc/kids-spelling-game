import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

function LearningPage() {
  const navigate = useNavigate();
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [spellingWords, setSpellingWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentWord = spellingWords[currentWordIndex];

  useEffect(() => {
    // Load spellings from LocalStorage
    const savedSpellings = localStorage.getItem('spellyquest_spellings');
    if (savedSpellings) {
      setSpellingWords(JSON.parse(savedSpellings));
    } else {
      // Handle case where no spellings are saved (e.g., direct navigation)
      console.warn("No spellings found in LocalStorage. Navigating back to input.");
      navigate('/input');
    }
  }, [navigate]); // Add navigate to dependencies

  useEffect(() => {
    // Speak the word when it changes
    if (currentWord) {
      speak(currentWord);
    }
  }, [currentWord, speak]); // Add speak to dependencies

  const handleSpeakWord = () => {
    if (currentWord) {
      speak(currentWord);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < spellingWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Finished learning all words, navigate to game page
      navigate('/game');
    }
  };

  const handleFinishLearning = () => {
     navigate('/game');
  }

  if (spellingWords.length === 0) {
    // Render a loading or redirecting state if words are not loaded yet
    return <div className="flex items-center justify-center min-h-screen bg-blue-400 text-white">Loading spellings...</div>;
  }

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-400 to-cyan-500 text-white p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-center drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Learn Your Spellings!
      </motion.h1>

      <motion.div
        className="bg-white text-gray-800 rounded-lg shadow-xl p-6 mb-8 text-center w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-semibold mb-4"
          key={currentWordIndex} // Key change triggers animation on word change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentWord}
        </motion.h2>
        <button
          className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSpeakWord}
          disabled={isSpeaking}
        >
          {isSpeaking ? 'Speaking...' : 'Listen'}
        </button>
      </motion.div>

      {/* Placeholder for Interactive Activities */}
      <motion.div
         className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-xl p-6 mb-8"
         initial={{ x: -100, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-2xl font-semibold mb-4">Activities</h3>
        <p className="text-gray-600 mb-4">Interactive activities (tracing, missing letters) will go here in a later phase.</p>
        {/* TODO: Implement Tracing and Missing Letters activities */}
        <div className="flex justify-around">
            <motion.div
                className="bg-yellow-200 p-4 rounded-lg text-center w-24"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                Trace
            </motion.div>
             <motion.div
                className="bg-pink-200 p-4 rounded-lg text-center w-24"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                Fill In
            </motion.div>
        </div>
      </motion.div>


      <motion.button
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95 mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextWord}
      >
        {currentWordIndex < spellingWords.length - 1 ? 'Next Word' : 'Finish Learning'}
      </motion.button>

       {currentWordIndex === spellingWords.length - 1 && (
         <motion.button
           className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleFinishLearning}
         >
           Go to Game!
         </motion.button>
       )}
    </motion.div>
  );
}

export default LearningPage;
