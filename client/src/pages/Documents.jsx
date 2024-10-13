import React, { useState, useEffect } from 'react';
import LectureRecorder from '../components/LectureRecorder';
import CourseDocuments from '../components/CourseDocuments';
import Sidebar from '../components/Sidebar';

const Documents = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const clientId = 1123;
  const courseId = 1235; 

  useEffect(() => {
    // Load documents from local storage on component mount
    const savedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setUploadedDocuments(savedDocuments);
  }, []);

  useEffect(() => {
    // Save documents to local storage whenever the documents state changes
    localStorage.setItem('documents', JSON.stringify(uploadedDocuments));
  }, [uploadedDocuments]);

  const handleUpload = (newDocument) => {
    setUploadedDocuments(prevDocuments => [...prevDocuments, newDocument]);
  };

  return (
    <div className="flex h-screen bg-sand-100">
      <Sidebar clientId={clientId} courseId={courseId} onUpload={handleUpload} />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-sand-200 rounded-lg shadow-lg p-6 mb-6 border-[#424530] border-4">
          <LectureRecorder onUpload={handleUpload} />
        </div>
        <div className="bg-sand-200 rounded-lg shadow-lg p-6 border-[#424530] border-4">
          <CourseDocuments documents={uploadedDocuments} />
        </div>
      </div>
    </div>
  );
};

export default Documents;