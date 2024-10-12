import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lectures from './pages/Lectures';
// import Quizzes from './pages/Quizzes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center font-display font-bold text-xl">
                OC
              </div>
              <Link to="/" className="hover:text-secondary transition-colors duration-200">
                <h1 className="text-2xl font-display font-bold">OpεnContεxt</h1>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link to="/chat" className="hover:text-secondary transition-colors duration-200">Chat</Link>
              <Link to="/lectures" className="hover:text-secondary transition-colors duration-200">Lectures</Link>
              {/* <Link to="/quizzes" className="hover:text-secondary transition-colors duration-200">Quizzes</Link> */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/lectures" element={<Lectures />} />
            {/* <Route path="/quizzes" element={<Quizzes />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;