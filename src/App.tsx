import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SpellInputPage from './pages/SpellInputPage';
import LearningPage from './pages/LearningPage';
import GamePage from './pages/GamePage';
import TestPage from './pages/TestPage';
import VictoryPage from './pages/VictoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/input" element={<SpellInputPage />} />
      <Route path="/learn" element={<LearningPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/victory" element={<VictoryPage />} />
    </Routes>
  );
}

export default App;
