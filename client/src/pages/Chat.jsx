import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import ChatHistory from '../components/ChatHistory';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChatHistory(storedHistory);
  }, []);

  const saveChat = (messages) => {
    const newChat = {
      id: Date.now(),
      title: messages[0]?.text.slice(0, 30) || 'New Chat',
      messages,
    };
    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const deleteChat = (id) => {
    const updatedHistory = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    if (selectedChat && selectedChat.id === id) {
      setSelectedChat(null);
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-svh bg-gray-100">
      <ChatHistory
        chatHistory={chatHistory}
        onSelectChat={setSelectedChat}
        onDeleteChat={deleteChat}
        onNewChat={handleNewChat}
      />
      <div className="flex-1">
        <ChatInterface
          initialMessages={selectedChat ? selectedChat.messages : []}
          onSaveChat={saveChat}
        />
      </div>
    </div>
  );
};

export default Chat;