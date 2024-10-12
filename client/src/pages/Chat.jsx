import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  return (
    <>
      <Sidebar />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </>
  );
};

export default Chat;