import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import GenerateQuiz from './GenerateQuiz';

const Quiz = () => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const documents = [
    { type: 'Lecture', number: 1, title: 'Introduction to React' },
    { type: 'PDF', number: 5, title: 'Advanced JavaScript Concepts' },
    { type: 'Lecture', number: 2, title: 'State Management in React' },
    { type: 'PDF', number: 3, title: 'CSS Flexbox and Grid' },
  ];

  const handleDocumentToggle = (doc) => {
    setSelectedDocuments(prev => 
      prev.some(d => d.type === doc.type && d.number === doc.number)
        ? prev.filter(d => !(d.type === doc.type && d.number === doc.number))
        : [...prev, doc]
    );
  };

  const handleGenerateQuiz = () => {
    if (selectedDocuments.length > 0) {
      setShowQuiz(true);
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-[#EFE3CB] rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-4">
            <div className="flex flex-wrap gap-2 p-2 border-4 border-[#62684A] rounded-md min-h-[40px]">
              {selectedDocuments.map((doc, index) => (
                <span key={index} className="bg-[#62684A] text-[#FFEFCD] px-2 font-extrabold py-1 rounded-md flex items-center">
                  {doc.type} {doc.number}
                  <X size={24} className="ml-2 bg-[#62684A] cursor-pointer" onClick={() => handleDocumentToggle(doc)} />
                </span>
              ))}
            </div>
            <ChevronDown size={30} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#62684A]" />
          </div>
          <div className="max-h-40 overflow-y-auto mb-4 bg-[#F5F5F5] rounded-md">
            {documents.map((doc, index) => (
              <div
                key={index}
                className={`p-2 cursor-pointer ${
                  selectedDocuments.some(d => d.type === doc.type && d.number === doc.number)
                    ? 'bg-[#62684A] text-[#FFEFCD] font-bold'
                    : 'bg-[#FFEFCD] text-[#62684A] hover:bg-[#FAEADD]'
                }`}
                onClick={() => handleDocumentToggle(doc)}
              >
                {doc.type} {doc.number}: {doc.title}
              </div>
            ))}
          </div>
          <button
            className="w-full bg-[#EECC91] py-2 rounded-md font-semibold text-center text-[#62684A] hover:bg-[#E0BC54] transition-colors"
            onClick={handleGenerateQuiz}
            disabled={selectedDocuments.length === 0}
          >
            Generate Quiz
          </button>
        </div>

        <div className="bg-[#EFE3CB] text-[#62684A] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-[#62684A]">Past Quizzes</h2>
          {/* Add a list or grid of past quizzes here */}
        </div>
      </div>

      {showQuiz && (
        <GenerateQuiz
          documents={selectedDocuments}
          onClose={handleCloseQuiz}
        />
      )}
    </div>
  );
};

export default Quiz;