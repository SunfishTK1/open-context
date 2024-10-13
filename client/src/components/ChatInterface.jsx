import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic } from 'lucide-react';

const ChatInterface = ({ initialMessages, onSaveChat }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessages = [...messages, { text: inputText, sender: 'user' }];
      setMessages(newMessages);
      setInputText('');
      onSaveChat(newMessages);
      // Simulate AI response
      setTimeout(() => {
        const updatedMessages = [...newMessages, { text: "I'm processing your request...", sender: 'ai' }];
        setMessages(updatedMessages);
        onSaveChat(updatedMessages);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#FFF4DD]">
      <div className="bg-[#E0D6BF] p-4 border-b border-[#424530]">
        <h2 className="text-xl font-bold text-[#424530]">Chat with OpenContext</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-[#EECC91] text-[#424530]' 
                : 'bg-[#E0D6BF] text-[#424530] border border-[#424530]'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
  );
};

export default ChatInterface;