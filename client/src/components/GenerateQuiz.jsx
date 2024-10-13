import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GenerateQuiz = ({ documents, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to generate questions
    setTimeout(() => {
      const generatedQuestions = documents.flatMap(doc => [
        {
          question: `What is the main topic of ${doc.type} ${doc.number}?`,
          options: ["Catastrophic Forgetting", "Ethics of AI", "Future of Neural Networks", "Machine Learning Essentials"],
          correctAnswer: 1
        },
        {
          question: `Which type of learning is most affected by Catastrophic Forgetting?`,
          options: ["Reinforcement Learning", "Continual Learning", "Supervised Learning", "Unsupervised Learning"],
          correctAnswer: 2
        }, 
        {
            question: `Which type of learning is most affected by Catastrophic Forgetting?`,
            options: ["Principal Component Analysis (PCA)", "Batch Normalization", "Gradient Descent Optimization", "Elastic Weight Consolidation (EWC)"],
            correctAnswer: 4  
        }
      ]);
      setQuestions(generatedQuestions);
      setIsLoading(false);
    }, 2000);
  }, [documents]);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Generating Quiz...</h3>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Quiz for Selected Documents</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {!showResults ? (
          <div>
            <p className="mb-4">Question {currentQuestion + 1} of {questions.length}</p>
            <h4 className="text-lg font-semibold mb-2">{questions[currentQuestion].question}</h4>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold mb-2">Quiz Results</h4>
            <p className="mb-4">You scored {score} out of {questions.length}</p>
            <button onClick={resetQuiz} className="bg-[#EFCB63] text-[#62684A] py-2 px-4 rounded-md font-semibold mr-2">Retake Quiz</button>
            <button onClick={onClose} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQuiz;