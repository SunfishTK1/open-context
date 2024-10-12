import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chat with AI</h1>
      <ChatInterface />
    </div>
  );
};

export default Chat;