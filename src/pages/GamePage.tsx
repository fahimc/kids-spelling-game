import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import shuffleArray from '../utils/shuffleArray';

function GamePage() {
  const navigate = useNavigate();
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Load spellings from LocalStorage
    const savedSpellings = localStorage.getItem('spellyquest_spellings');
    if (savedSpellings) {
      const words = JSON.parse(savedSpellings);
      setGameWords(words);
      if (words.length > 0) {
         const word = words[currentWordIndex];
         setCurrentWord(word);
         setScrambledLetters(shuffleArray(word.split('')));
      } else {
         console.warn("No spellings found in LocalStorage. Navigating back to input.");
         navigate('/input');
      }
    } else {
      // Handle case where no spellings are saved (e.g., direct navigation)
      console.warn("No spellings found in LocalStorage. Navigating back to input.");
      navigate('/input');
    }
  }, [navigate, currentWordIndex]); // Add navigate and currentWordIndex to dependencies

  useEffect(() => {
    // Update scrambled letters when the current word changes
    if (currentWord) {
      setScrambledLetters(shuffleArray(currentWord.split('')));
      setUserInput('');
      setFeedback(null);
    }
  }, [currentWord]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleCheckAnswer = () => {
    if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
      setFeedback('Correct!');
      // Move to the next word after a short delay
      setTimeout(() => {
        handleNextWord();
      }, 1500);
    } else {
      setFeedback('Try again!');
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Finished all game words, navigate to test page
      navigate('/test');
    }
  };

  const handleSpeakWord = () => {
    if (currentWord) {
      speak(currentWord);
    }
  };

  if (gameWords.length === 0) {
    // Render a loading or redirecting state if words are not loaded yet
    return <div className="flex items-center justify-center min-h-screen bg-purple-400 text-white">Loading spellings...</div>;
  }

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 text-white p-4 overflow-y-auto"
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
        Unscramble the Word!
      </motion.h1>

      <motion.div
        className="bg-white text-gray-800 rounded-lg shadow-xl p-6 mb-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-semibold mb-4">{scrambledLetters.join(' ')}</h2>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSpeakWord}
          disabled={isSpeaking}
        >
          {isSpeaking ? 'Speaking...' : 'Listen'}
        </button>
      </motion.div>

      <motion.input
        type="text"
        className="w-full max-w-sm p-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:border-purple-800 text-gray-800 text-lg mb-4"
        placeholder="Type the word here"
        value={userInput}
        onChange={handleInputChange}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />

      {feedback && (
        <motion.p
          className={`text-xl font-bold mb-4 ${feedback === 'Correct!' ? 'text-green-300' : 'text-red-300'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {feedback}
        </motion.p>
      )}

      <motion.button
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95 mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckAnswer}
        disabled={!userInput.trim()}
      >
        Check Answer
      </motion.button>

      {feedback === 'Correct!' && (
         <motion.button
           className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleNextWord}
         >
           {currentWordIndex < gameWords.length - 1 ? 'Next Word' : 'Go to Test!'}
         </motion.button>
       )}
    </motion.div>
  );
}

export default GamePage;
