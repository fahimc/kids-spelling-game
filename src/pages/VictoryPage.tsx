import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfettiExplosion from 'react-confetti-explosion';

function VictoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 0 }; // Get score and total from state

  const handlePlayAgain = () => {
    navigate('/input'); // Navigate back to the Spell Input page
  };

  const isExploding = score > 0; // Explode confetti if score is greater than 0

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Confetti Explosion */}
      {isExploding && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={200}
            width={1600}
            colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
          />
        </div>
      )}


      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-8 text-center drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Victory! 🎉
      </motion.h1>

      <motion.div
        className="bg-white text-gray-800 rounded-lg shadow-xl p-6 mb-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-semibold mb-4">Your Score:</h2>
        <p className="text-4xl font-bold text-green-600">{score} / {total}</p>
      </motion.div>

      <motion.button
        className="bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out active:scale-95"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePlayAgain}
      >
        Play Again!
      </motion.button>
    </motion.div>
  );
}

export default VictoryPage;
