import React, { useState, useEffect } from 'react';
import { Send, Mic, Upload } from 'lucide-react';
import ChatHistory from './ChatHistory';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [currentChatId, setCurrentChatId] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [clientId, setClientId] = useState('default_client');
    const [courseId, setCourseId] = useState('default_course');
    const [lectureId, setLectureId] = useState('default_lecture');
    const [chatHistory, setChatHistory] = useState([]);
  

    useEffect(() => {
        fetchChatHistory();
      }, []);

      const fetchChatHistory = async () => {
        try {
          const response = await fetch('http://localhost:8000/chat/history');
          if (!response.ok) {
            throw new Error('Failed to fetch chat history');
          }
          const data = await response.json();
          setChatHistory(data);
          if (data.length > 0) {
            setCurrentChatId(data[0].id);
            setMessages(data[0].messages);
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
    
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
              body: JSON.stringify({ 
                messages: updatedMessages,
                uploadedFileId: uploadedFile ? uploadedFile.id : null // Include the uploaded file ID if available
              }),
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`http://localhost:8002/upload-pdf/${clientId}/${courseId}/${lectureId}/pdf`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('PDF upload failed');
        }

        const data = await response.json();
        console.log('PDF processed:', data);
        
        // Update this part to match the actual response structure
        setUploadedFile({
          name: file.name,
          id: data.path || data.id || 'unknown' // Use an appropriate identifier from the response
        });
        
        // Add a system message to indicate that a PDF has been uploaded
        const newMessage = { role: 'system', content: `PDF "${file.name}" has been uploaded and processed. You can now ask questions about its content.` };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        // Handle error (e.g., show an error message to the user)
      }
    } else {
      console.error('Please upload a PDF file');
      // Show an error message to the user
    }
  };

  return (
    <div className="flex h-screen">
      <ChatHistory
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
            <label className="ml-2 cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload size={20} className="text-[#424530] hover:text-[#E09132] transition-colors" />
            </label>
          </div>
          {uploadedFile && (
            <div className="mt-2 text-sm text-[#424530]">
              Uploaded: {uploadedFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;