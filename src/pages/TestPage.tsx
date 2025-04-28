import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

function TestPage() {
  const navigate = useNavigate();
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [testWords, setTestWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    // Load spellings from LocalStorage
    const savedSpellings = localStorage.getItem('spellyquest_spellings');
    if (savedSpellings) {
      const words = JSON.parse(savedSpellings);
      setTestWords(words);
      if (words.length > 0 && currentWordIndex < words.length) {
         const word = words[currentWordIndex];
         setCurrentWord(word);
         setUserInput('');
         setFeedback(null);
         setShowNextButton(false);
         // Automatically speak the word when the component loads or word changes
         speak(word);
      } else if (currentWordIndex >= words.length && words.length > 0) {
        // All words tested, navigate to victory page
        navigate('/victory', { state: { score, total: words.length } });
      } else if (words.length === 0) {
         console.warn("No spellings found in LocalStorage. Navigating back to input.");
         navigate('/input');
      }
    } else {
      // Handle case where no spellings are saved (e.g., direct navigation)
      console.warn("No spellings found in LocalStorage. Navigating back to input.");
      navigate('/input');
    }
  }, [currentWordIndex, navigate, speak]); // Added speak to dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    // Clear feedback when user starts typing again
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleCheckAnswer = () => {
    if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
      setFeedback('Correct!');
      setScore(score + 1);
    } else {
      setFeedback(`Incorrect. The word was "${currentWord}".`);
    }
    setShowNextButton(true);
  };

  const handleNextWord = () => {
    setCurrentWordIndex(currentWordIndex + 1);
  };

  const handleSpeakWord = () => {
    if (currentWord) {
      speak(currentWord);
    }
  };

  if (testWords.length === 0 && currentWordIndex === 0) {
     // Render a loading or redirecting state if words are not loaded yet and it's the first word
     return <div className="flex items-center justify-center min-h-screen bg-red-400 text-white">Loading spellings...</div>;
   }


  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-red-400 to-orange-500 text-white p-4 overflow-y-auto"
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
        Test Your Spelling!
      </motion.h1>

      <motion.div
        className="bg-white text-gray-800 rounded-lg shadow-xl p-6 mb-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Word {currentWordIndex + 1} of {testWords.length}</h2>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSpeakWord}
          disabled={isSpeaking}
        >
          {isSpeaking ? 'Speaking...' : 'Listen to the word'}
        </button>
      </motion.div>

      <motion.input
        type="text"
        className="w-full max-w-sm p-3 rounded-lg border-2 border-red-600 focus:outline-none focus:border-red-800 text-gray-800 text-lg mb-4"
        placeholder="Type the word here"
        value={userInput}
        onChange={handleInputChange}
        disabled={showNextButton} // Disable input after checking answer
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />

      {feedback && (
        <motion.p
          className={`text-xl font-bold mb-4 ${feedback.startsWith('Correct') ? 'text-green-300' : 'text-yellow-300'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {feedback}
        </motion.p>
      )}

      {!showNextButton && (
        <motion.button
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95 mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckAnswer}
          disabled={!userInput.trim()}
        >
          Check Spelling
        </motion.button>
      )}

      {showNextButton && (
         <motion.button
           className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleNextWord}
         >
           {currentWordIndex < testWords.length - 1 ? 'Next Word' : 'Finish Test!'}
         </motion.button>
       )}

       <div className="mt-8 text-2xl font-bold">
         Score: {score} / {testWords.length}
       </div>
    </motion.div>
  );
}

export default TestPage;
