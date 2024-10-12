import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mic, HelpCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FFF4DD] bg-center flex items-center justify-center text-[#424530]" style={{ backgroundImage: "url('/abstract-bg1.jpg')" }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Welcome to OpenContext</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/chat" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-indigo-100">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
              <MessageCircle className="mr-2" />
              Start a New Chat
            </h2>
            <p className="text-gray-600">Explore knowledge with AI-powered conversations.</p>
          </Link>
          <Link to="/lectures" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-indigo-100">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
              <Mic className="mr-2" />
              Record a Lecture
            </h2>
            <p className="text-gray-600">Capture and transcribe your lectures for easy reference.</p>
          </Link>
          <Link to="/lectures" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-indigo-100">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
              <HelpCircle className="mr-2" />
              Generate a Quiz
            </h2>
            <p className="text-gray-600">Create quizzes based on your lecture transcriptions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;