import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lectures from './pages/Lectures';
import Quizzes from './pages/Quizzes';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-800 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white text-indigo-800 rounded-full flex items-center justify-center font-bold">
                OC
              </div>
              <h1 className="text-2xl font-bold">OpenContext</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/chat" className="hover:underline">Chat</Link>
              <Link to="/lectures" className="hover:underline">Lectures</Link>
              <Link to="/quizzes" className="hover:underline">Quizzes</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/quizzes" element={<Quizzes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;