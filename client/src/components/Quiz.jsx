import React, { useState } from 'react';

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  // Mock quiz data
  const quizData = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Jupiter", "Venus", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnded(false);
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const renderQuestion = () => {
    const question = quizData[currentQuestion];
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderQuizEnd = () => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
      <p className="text-xl mb-4">Your score: {score} out of {quizData.length}</p>
      <button
        onClick={startQuiz}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Restart Quiz
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      {!quizStarted ? (
        <button
          onClick={startQuiz}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Start Quiz
        </button>
      ) : quizEnded ? (
        renderQuizEnd()
      ) : (
        renderQuestion()
      )}
    </div>
  );
};

export default Quiz;