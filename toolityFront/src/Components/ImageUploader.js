import React, { useState } from 'react';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type === 'image/jpeg') {
        setSelectedFile(file);
        setUploadStatus('');
      } else {
        setUploadStatus('Please select a JPEG image file only.');
        setSelectedFile(null);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');

    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);

      // Send POST request with multipart/form-data
      const response = await fetch('http://localhost:5198/FileUploderControler/uploadSingle?username=Harut', {
        method: 'POST',
        headers: {
          'accept': '*/*'
        },
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        setSelectedFile(null);
        // Reset file input
        document.getElementById('file-input').value = '';
      } else {
        setUploadStatus(`Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setUploadStatus(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>JPEG Image Uploader</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          id="file-input"
          type="file"
          accept=".jpeg,.jpg"
          onChange={handleFileSelect}
          style={{ marginBottom: '10px' }}
        />
        
        {selectedFile && (
          <div style={{ marginBottom: '10px' }}>
            <p><strong>Selected file:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        style={{
          padding: '10px 20px',
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {uploadStatus && (
        <div
          style={{
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: uploadStatus.includes('successful') ? '#d4edda' : '#f8d7da',
            color: uploadStatus.includes('successful') ? '#155724' : '#721c24',
            border: `1px solid ${uploadStatus.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`
          }}
        >
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 