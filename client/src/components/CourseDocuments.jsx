import React from 'react';
import { Play, FileText, HelpCircle, Trash2 } from 'lucide-react';

const CourseDocuments = ({ documents }) => {
  const handlePlay = (document) => {
    console.log("Play audio", document);
  };

  const handleTranscribe = (document) => {
    console.log("Transcribe document", document);
  };

  const handleGenerateQuiz = (document) => {
    console.log("Generate quiz for document", document);
  };

  const handleDelete = (document) => {
    console.log("Delete document", document);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Course Documents</h2>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="bg-sand-100 p-3 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-500">{doc.date}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handlePlay(doc)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <Play size={16} />
              </button>
              <button onClick={() => handleTranscribe(doc)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                <FileText size={16} />
              </button>
              <button onClick={() => handleGenerateQuiz(doc)} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
                <HelpCircle size={16} />
              </button>
              <button onClick={() => handleDelete(doc)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDocuments;