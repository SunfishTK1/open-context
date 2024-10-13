import React, { useState } from 'react';
import LectureRecorder from '../components/LectureRecorder';
import CourseDocuments from '../components/CourseDocuments';
import Sidebar from '../components/Sidebar';

const Documents = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleUpload = (newDocument) => {
    setUploadedDocuments([...uploadedDocuments, newDocument]);
  };

  return (
    <div className="flex h-screen bg-sand-100">
      <Sidebar />
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