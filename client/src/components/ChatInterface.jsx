import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm processing your request...", sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Chat with AI</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg p-2">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 bg-transparent outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="ml-2 text-gray-500 hover:text-gray-700">
            <Send size={20} />
          </button>
          <button className="ml-2 text-gray-500 hover:text-gray-700">
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;