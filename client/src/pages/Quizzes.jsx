import React from 'react';
import Sidebar from '../components/Sidebar';
import Quiz from '../components/Quiz';

const Quizzes = () => {
  return (
    <>
      <Sidebar />
      <div className="flex-1">
        <Quiz />
      </div>
    </>
  );
};

export default Quizzes;