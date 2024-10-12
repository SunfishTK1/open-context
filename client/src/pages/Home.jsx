import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Mic, BookOpen, HelpCircle } from 'lucide-react';

const Home = () => {
  return (
    <>
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to OpenContext</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/chat" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Start a New Chat</h2>
            <p className="text-gray-600">Explore knowledge with AI-powered conversations.</p>
          </Link>
          <Link to="/lectures" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Record a Lecture</h2>
            <p className="text-gray-600">Capture and transcribe your lectures for easy reference.</p>
          </Link>
          <Link to="/quizzes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Generate a Quiz</h2>
            <p className="text-gray-600">Create quizzes based on your lecture transcriptions.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;