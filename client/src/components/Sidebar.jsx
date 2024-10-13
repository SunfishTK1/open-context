import React, { useState, useRef } from 'react';
import { MessageSquare, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const Sidebar = () => {
    const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleUploadLecture = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      console.log("Uploaded lecture:", file);
      // implement the logic to handle the audio file
    } else {
      setError("Please upload an audio file for lectures.");
    }
  };

  const handleUploadPDF = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', file);

        console.log("file sent: " + file.name)

        const response = await fetch(
            'http://0.0.0.0:8080/extract_text/',
            {
                method:"POST",
                body:formData,
            }
        );

        const extractedText = await response.text(); 
        console.log("Extracted text:", extractedText);


        // const response = await axios.post('http://0.0.0.0:8080/convert/', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   responseType: 'blob',
        // });


        console.log("Response from the server: " + response.data);
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `searchable_${file.name}`);
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
      } catch (error) {
        console.error("Error uploading PDF:", error);
        setError("Error processing PDF. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setError("Please upload a PDF file.");
    }
  };

  const handleUploadNotes = async (event) => {
    const files = Array.from(event.target.files);
    if (files.every(file => file.type.startsWith('image/'))) {
      setIsUploading(true);
      setError(null);
      setPreviewImages([]);

      try {
        // Generate previews
        const previews = await Promise.all(files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        }));

        setPreviewImages(previews);

        // Send images to backend for PDF conversion
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append('files', file, `image_${index}.${file.name.split('.').pop()}`);
        });

        const response = await axios.post('http://0.0.0.0:8080/convert_images_to_pdf/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });

        // Offer the processed PDF for download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'searchable_notes.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error processing notes:", error);
        setError("Error processing notes. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setError("Please upload only image files for notes.");
    }
  };

  return (
    <div className="w-64 bg-sand-200 p-6 space-y-4">
      <button className="w-full bg-olive-600 text-sand-100 px-4 py-2 rounded-lg shadow-md hover:bg-olive-700 transition-colors">
        Start a new chat
      </button>
      <label className="w-full bg-sand-300 text-olive-700 px-4 py-2 rounded-lg shadow-md hover:bg-sand-400 transition-colors flex items-center justify-center cursor-pointer">
        <Upload className="mr-2" size={20} />
        Upload Lecture
        <input type="file" accept="audio/*" onChange={handleUploadLecture} className="hidden" />
      </label>
      <label className="w-full bg-sand-300 text-olive-700 px-4 py-2 rounded-lg shadow-md hover:bg-sand-400 transition-colors flex items-center justify-center cursor-pointer">
        <FileText className="mr-2" size={20} />
        Upload PDF
        <input type="file" accept=".pdf" onChange={handleUploadPDF} className="hidden" />
      </label>
      <label className="w-full bg-sand-300 text-olive-700 px-4 py-2 rounded-lg shadow-md hover:bg-sand-400 transition-colors flex items-center justify-center cursor-pointer">
        <MessageSquare className="mr-2" size={20} />
        Upload Notes
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUploadNotes}
          className="hidden"
          ref={fileInputRef}
        />
      </label>
      {isUploading && <p className="text-olive-600">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {previewImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-olive-700 font-semibold mb-2">Image Previews:</h3>
          <div className="flex flex-wrap gap-2">
            {previewImages.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;