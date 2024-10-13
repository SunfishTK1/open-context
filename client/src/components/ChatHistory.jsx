import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';

const ChatHistory = ({ onSelectChat, onDeleteChat, onNewChat, currentChatId }) => {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChatHistory(savedChatHistory);
  }, [currentChatId]);

  return (
    <div className="w-64 bg-[#E0D6BF] border-r border-[#424530] p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4 text-[#424530]">Chat History</h2>
      <button
        className="w-full bg-[#EECC91] text-[#424530] rounded-lg py-2 mb-4 hover:bg-[#E09132] transition-colors"
        onClick={onNewChat}
      >
        New Chat
      </button>
      {chatHistory.length > 0 ? (
        chatHistory.map((chat) => (
          <div key={chat.id} className={`flex items-center justify-between mb-2 p-2 hover:bg-[#E09132] rounded ${currentChatId === chat.id ? 'bg-[#E09132]' : ''}`}>
            <button
              className="flex items-center text-left w-full text-[#424530]"
              onClick={() => onSelectChat(chat)}
            >
              <MessageSquare size={16} className="mr-2" />
              <span className="truncate">{chat.title}</span>
            </button>
            <button
              className="text-[#424530] hover:text-[#E09132]"
              onClick={() => onDeleteChat(chat.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))
      ) : (
        <p className="text-[#424530]">No chat history available.</p>
      )}
    </div>
  );
};

export default ChatHistory;