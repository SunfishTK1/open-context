import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, HelpCircle, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Lectures', icon: BookOpen, path: '/lectures' },
    { name: 'Quizzes', icon: HelpCircle, path: '/quizzes' },
  ];

  return (
    <div className="w-64 bg-white h-full p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-xs">OC</span>
        </div>
        <h1 className="text-xl font-bold">OpenContext</h1>
      </div>
      <Link to="/chat" className="w-full bg-yellow-400 text-black py-2 px-4 rounded-full mb-4 flex items-center justify-center">
        <Plus size={18} className="mr-2" />
        New Chat
      </Link>
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-2 rounded-lg mb-2 ${
              location.pathname === item.path ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} className="mr-2" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;