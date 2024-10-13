import React, { useState, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import ChatHistory from './ChatHistory';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    if (savedChatHistory.length > 0) {
      setCurrentChatId(savedChatHistory[0].id);
      setMessages(savedChatHistory[0].messages);
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { role: 'user', content: inputText };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputText('');

      try {
        const response = await fetch('http://localhost:8000/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        setMessages(data);

        // Update chat history in localStorage
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const updatedHistory = chatHistory.map(chat => 
          chat.id === currentChatId ? { ...chat, messages: data } : chat
        );
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, title: 'New Chat', messages: [] };
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const updatedHistory = [newChat, ...chatHistory];
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  };

  const handleDeleteChat = (chatId) => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    
    if (chatId === currentChatId) {
      if (updatedHistory.length > 0) {
        setCurrentChatId(updatedHistory[0].id);
        setMessages(updatedHistory[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <ChatHistory
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3/4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-[#EECC91] text-[#424530]' 
                  : 'bg-[#E0D6BF] text-[#424530] border border-[#424530]'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#E0D6BF] p-4 border-t border-[#424530]">
          <div className="flex items-center bg-[#FFF4DD] rounded-lg p-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent outline-none text-[#424530]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="ml-2 text-[#424530] hover:text-[#E09132] transition-colors">
              <Send size={20} />
            </button>
            <button className="ml-2 text-[#424530] hover:text-[#E09132] transition-colors">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;