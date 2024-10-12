import React, { useState } from 'react';
import { Mic, Square, Upload } from 'lucide-react';

const LectureRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedLectures, setRecordedLectures] = useState([]);

  const startRecording = () => {
    setIsRecording(true);
    // dummy
    console.log('Starting recording...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // dummy
    console.log('Stopping recording...');
    const newLecture = {
      id: Date.now(),
      title: `Lecture ${recordedLectures.length + 1}`,
      date: new Date().toLocaleDateString(),
    };
    setRecordedLectures([...recordedLectures, newLecture]);
  };

  const uploadAudio = (event) => {
    const file = event.target.files[0];
    if (file) {
      // dummy: process the uploaded audio file
      console.log('Uploading file:', file.name);
      const newLecture = {
        id: Date.now(),
        title: file.name,
        date: new Date().toLocaleDateString(),
      };
      setRecordedLectures([...recordedLectures, newLecture]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lecture Recorder</h2>
      <div className="flex items-center mb-6">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white py-2 px-4 rounded-full flex items-center"
          >
            <Square size={20} className="mr-2" />
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white py-2 px-4 rounded-full flex items-center"
          >
            <Mic size={20} className="mr-2" />
            Start Recording
          </button>
        )}
        <label className="ml-4 bg-green-500 text-white py-2 px-4 rounded-full flex items-center cursor-pointer">
          <Upload size={20} className="mr-2" />
          Upload Audio
          <input type="file" accept="audio/*" onChange={uploadAudio} className="hidden" />
        </label>
      </div>
      <h3 className="text-xl font-semibold mb-2">Recorded Lectures</h3>
      <ul className="space-y-2">
        {recordedLectures.map((lecture) => (
          <li key={lecture.id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">{lecture.title}</h4>
            <p className="text-sm text-gray-500">{lecture.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LectureRecorder;