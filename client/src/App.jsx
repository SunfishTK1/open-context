import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lectures from './pages/Lectures';
import Quizzes from './pages/Quizzes';

const Navigation = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className={`${isHomePage ? '' : 'bg-[#A58E74] text-[#FFF4DD]'} p-4 shadow-md`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 ${isHomePage ? 'bg-[#A58E74] text-[#FFF4DD]' : 'bg-[#FFF4DD] text-[#A58E74]'} rounded-full flex items-center justify-center font-display font-bold text-xl`}>
            OC
          </div>
          <Link to="/" className={`${isHomePage ? 'text-[#424530]' : 'text-[#FFF4DD]'} hover:text-[#E09132] transition-colors duration-200`}>
            <h1 className="text-2xl font-display font-bold">OpεnContεxt</h1>
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/chat" className={`${isHomePage ? 'text-[#424530]' : 'text-[#FFF4DD]'} hover:text-[#E09132] transition-colors duration-200`}>Chat</Link>
          <Link to="/lectures" className={`${isHomePage ? 'text-[#424530]' : 'text-[#FFF4DD]'} hover:text-[#E09132] transition-colors duration-200`}>Lectures</Link>
          <Link to="/quizzes" className={`${isHomePage ? 'text-[#424530]' : 'text-[#FFF4DD]'} hover:text-[#E09132] transition-colors duration-200`}>Quizzes</Link>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen ${isHomePage ? '' : 'bg-[#FFF4DD]'}`}>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={
          <main className="container mx-auto mt-8 px-4">
            <Chat />
          </main>
        } />
        <Route path="/lectures" element={
          <main className="container mx-auto mt-8 px-4">
            <Lectures />
          </main>
        } />
        <Route path="/quizzes" element={
          <main className="container mx-auto mt-8 px-4">
            <Quizzes />
          </main>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;