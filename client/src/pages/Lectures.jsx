import React from 'react';
import Sidebar from '../components/Sidebar';
import LectureRecorder from '../components/LectureRecorder';

const Lectures = () => {
  return (
    <>
      <Sidebar />
      <div className="flex-1">
        <LectureRecorder />
      </div>
    </>
  );
};

export default Lectures;