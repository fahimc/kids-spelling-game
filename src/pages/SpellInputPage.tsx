import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function SpellInputPage() {
  const navigate = useNavigate();
  const [spellings, setSpellings] = useState<string[]>(Array(10).fill('')); // Start with 10 empty inputs

  const handleInputChange = (index: number, value: string) => {
    const newSpellings = [...spellings];
    newSpellings[index] = value;
    setSpellings(newSpellings);
  };

  const handleAddInput = () => {
    if (spellings.length < 20) { // Limit to 20 spellings
      setSpellings([...spellings, '']);
    }
  };

  const handleRemoveInput = (index: number) => {
    if (spellings.length > 10) { // Ensure at least 10 inputs remain
      const newSpellings = spellings.filter((_, i) => i !== index);
      setSpellings(newSpellings);
    }
  };

  const handleBeginJourney = () => {
    // Filter out empty strings and trim whitespace
    const validSpellings = spellings
      .map(s => s.trim())
      .filter(s => s !== '');

    if (validSpellings.length === 0) {
      alert('Please enter at least one spelling word.');
      return;
    }

    // TODO: Save spellings to context/localStorage in a later phase
    console.log('Spellings entered:', validSpellings);

    navigate('/learn'); // Navigate to the Learning page
  };

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 text-white p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Enter Your Spellings
      </motion.h1>

      <div className="w-full max-w-md mb-6">
        {spellings.map((spelling, index) => (
          <motion.div
            key={index}
            className="flex items-center mb-3"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <input
              type="text"
              className="flex-grow p-3 rounded-lg border-2 border-green-600 focus:outline-none focus:border-green-800 text-gray-800 text-lg"
              placeholder={`Spelling Word ${index + 1}`}
              value={spelling}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            {spellings.length > 10 && (
              <button
                className="ml-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition duration-200 ease-in-out active:scale-95"
                onClick={() => handleRemoveInput(index)}
                aria-label={`Remove spelling word ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {spellings.length < 20 && (
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg mb-6 transform transition duration-300 ease-in-out active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddInput}
        >
          Add More Words ({spellings.length}/20)
        </motion.button>
      )}


      <motion.button
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBeginJourney}
      >
        Begin Journey!
      </motion.button>
    </motion.div>
  );
}

export default SpellInputPage;
