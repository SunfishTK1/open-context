import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lectures from './pages/Lectures';
import Quizzes from './pages/Quizzes';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;