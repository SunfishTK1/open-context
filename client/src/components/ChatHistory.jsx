import React from 'react';
import { Trash2, MessageSquare } from 'lucide-react';

const ChatHistory = ({ chatHistory, onSelectChat, onDeleteChat, onNewChat }) => {
    return (
      <div className="w-64 bg-[#E0D6BF] border-r border-[#424530] p-4 overflow-y-auto h-full">
        <h2 className="text-xl font-bold mb-4 text-[#424530]">Chat History</h2>
        <button
          className="w-full bg-[#EECC91] text-[#424530] rounded-lg py-2 mb-4 hover:bg-[#E09132] transition-colors"
          onClick={onNewChat}
        >
          New Chat
        </button>
        {chatHistory.map((chat) => (
          <div key={chat.id} className="flex items-center justify-between mb-2 p-2 hover:bg-[#E09132] rounded">
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
        ))}
      </div>
    );
  };
  

export default ChatHistory;