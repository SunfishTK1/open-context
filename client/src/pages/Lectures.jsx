import React from 'react';
import Sidebar from '../components/Sidebar';
import LectureRecorder from '../components/LectureRecorder';

const Lectures = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <LectureRecorder />
      </div>
    </div>
  );
};

export default Lectures;