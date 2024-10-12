import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Play, Pause, Trash2, FileText, HelpCircle } from 'lucide-react';
import GenerateQuiz from './GenerateQuiz';

const LectureRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedLectures, setRecordedLectures] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTranscription, setCurrentTranscription] = useState(null);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [currentLectureForQuiz, setCurrentLectureForQuiz] = useState(null);
  
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newLecture = {
          id: Date.now(),
          title: `Lecture ${recordedLectures.length + 1}`,
          date: new Date().toLocaleDateString(),
          audio: audioUrl,
        };
        setRecordedLectures([...recordedLectures, newLecture]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      const newLecture = {
        id: Date.now(),
        title: file.name,
        date: new Date().toLocaleDateString(),
        audio: audioUrl,
      };
      setRecordedLectures([...recordedLectures, newLecture]);
    }
  };

  const playAudio = (audioUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const deleteLecture = (id) => {
    setRecordedLectures(recordedLectures.filter(lecture => lecture.id !== id));
  };


  const transcribeLecture = async (lectureId) => {
    const lecture = recordedLectures.find(l => l.id === lectureId);
    if (!lecture) return;

    // dummy backend interation
    setCurrentTranscription("Transcribing...");
    
    setTimeout(() => {
      setCurrentTranscription(`This is a simulated transcription for "${lecture.title}". In a real application, this would be the actual transcribed text of the audio file.`);
    }, 2000);
  };

  const generateQuiz = (lectureId) => {
    const lecture = recordedLectures.find(l => l.id === lectureId);
    if (!lecture) return;

    setIsGeneratingQuiz(true);
    setCurrentLectureForQuiz(lecture);
  };

  const closeQuiz = () => {
    setIsGeneratingQuiz(false);
    setCurrentLectureForQuiz(null);
  };



  return (
    <div className="p-6 bg-white rounded-xl shadow-custom mt-6">
      <h2 className="text-3xl font-display font-bold mb-6 text-primary">Lecture Recorder</h2>
      <div className="flex items-center mb-8 space-x-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="btn btn-secondary flex items-center"
          >
            <Square size={20} className="mr-2" />
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="btn btn-primary flex items-center"
          >
            <Mic size={20} className="mr-2" />
            Start Recording
          </button>
        )}
        <label className="btn btn-secondary flex items-center cursor-pointer">
          <Upload size={20} className="mr-2" />
          Upload Audio
          <input type="file" accept="audio/*" onChange={uploadAudio} className="hidden" />
        </label>
      </div>
      <h3 className="text-2xl font-display font-semibold mb-4 text-primary-dark">Recorded Lectures</h3>
      <ul className="space-y-4">
        {recordedLectures.map((lecture) => (
          <li key={lecture.id} className="bg-background p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-lg text-primary">{lecture.title}</h4>
                <p className="text-sm text-gray-500">{lecture.date}</p>
              </div>
              <div className="flex space-x-2">
                {isPlaying && currentAudio && currentAudio.src === lecture.audio ? (
                  <button onClick={pauseAudio} className="p-2 bg-secondary text-white rounded-full">
                    <Pause size={20} />
                  </button>
                ) : (
                  <button onClick={() => playAudio(lecture.audio)} className="p-2 bg-primary text-white rounded-full">
                    <Play size={20} />
                  </button>
                )}
                <button onClick={() => transcribeLecture(lecture.id)} className="p-2 bg-indigo-500 text-white rounded-full">
                  <FileText size={20} />
                </button>
                <button onClick={() => generateQuiz(lecture.id)} className="p-2 bg-green-500 text-white rounded-full">
                  <HelpCircle size={20} />
                </button>
                <button onClick={() => deleteLecture(lecture.id)} className="p-2 bg-red-500 text-white rounded-full">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {currentTranscription && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Transcription:</h4>
          <p>{currentTranscription}</p>
        </div>
      )}
      {isGeneratingQuiz && currentLectureForQuiz && (
        <GenerateQuiz lecture={currentLectureForQuiz} onClose={closeQuiz} />
      )}
    </div>
  );
};

export default LectureRecorder;