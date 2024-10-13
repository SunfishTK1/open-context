import React from 'react';
import { Trash2, MessageSquare } from 'lucide-react';

const ChatHistory = ({ chatHistory, onSelectChat, onDeleteChat, onNewChat }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      <button
        className="w-full bg-blue-500 text-white rounded-lg py-2 mb-4 hover:bg-blue-600 transition-colors"
        onClick={onNewChat}
      >
        New Chat
      </button>
      {chatHistory.map((chat) => (
        <div key={chat.id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-100 rounded">
          <button
            className="flex items-center text-left w-full"
            onClick={() => onSelectChat(chat)}
          >
            <MessageSquare size={16} className="mr-2" />
            <span className="truncate">{chat.title}</span>
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => onDeleteChat(chat.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;