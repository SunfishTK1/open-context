import axios from 'axios';

const API_URL = 'http://localhost:8001';  // Make sure this matches your backend URL

export const uploadAudio = async (file, clientId, courseId, lectureId) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload-audio/${clientId}/${courseId}/${lectureId}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

export const getAudioFile = async (clientId, courseId, lectureId, fileType) => {
  try {
    const response = await axios.get(`${API_URL}/files/${clientId}/${courseId}/${lectureId}/${fileType}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error getting audio file:', error);
    throw error;
  }
};