import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import ChatHistory from '../components/ChatHistory';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/chat/history');
      const data = await response.json();
      setChatHistory(data);
      localStorage.setItem('chatHistory', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
      setChatHistory(storedHistory);
    }
  };

  const saveChat = async (messages) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      const updatedMessages = data.map(msg => ({
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai'
      }));

      if (selectedChat) {
        // Update existing chat
        const updatedChat = { ...selectedChat, messages: updatedMessages };
        const updatedHistory = chatHistory.map(chat => 
          chat.id === selectedChat.id ? updatedChat : chat
        );
        setChatHistory(updatedHistory);
        setSelectedChat(updatedChat);
      } else {
        // Create new chat
        const newChat = {
          id: Date.now(),
          title: updatedMessages[0]?.text.slice(0, 30) || 'New Chat',
          messages: updatedMessages,
        };
        const updatedHistory = [...chatHistory, newChat];
        setChatHistory(updatedHistory);
        setSelectedChat(newChat);
      }

      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Error saving chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (id) => {
    try {
      await fetch(`http://localhost:8000/chat/${id}`, { method: 'DELETE' });
      const updatedHistory = chatHistory.filter((chat) => chat.id !== id);
      setChatHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      if (selectedChat && selectedChat.id === id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen bg-[#FFF4DD]">
      <div className="flex-1 relative">
        <ChatInterface
          initialMessages={selectedChat ? selectedChat.messages : []}
          onSaveChat={saveChat}
        />
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;