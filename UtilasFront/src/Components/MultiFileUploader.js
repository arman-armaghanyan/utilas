import React, { useState } from 'react';

const MultiFileUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle multiple file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Filter valid files (you can customize file type validation here)
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');

        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        setUploadStatus(`${files.length - validFiles.length} file(s) were skipped (invalid type or size > 10MB)`);
      } else {
        setUploadStatus('');
      }

      setSelectedFiles(validFiles);
    }
  };

  // Remove individual file
  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setUploadStatus('');
      document.getElementById('multi-file-input').value = '';
    }
  };

  // Handle multiple file upload with proper multipart/form-data
  const handleUpload = async () =>
  {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select at least one file.');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading files...');
    setUploadProgress({});

    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Append all files to the form data with 'files' key
      // This matches the expected format for multiple file uploads
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Add additional parameters if needed by your backend
      formData.append('username', 'Harut');
      formData.append('resultId', null);
      // Log the FormData contents for debugging
      console.log('Uploading files:', selectedFiles.map(f => f.name));
      console.log('Total files to upload:', selectedFiles.length);

      // Send POST request with multipart/form-data to your specific endpoint
      const response = await fetch('https://localhost:7178/png_to_any_upload', {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      });
      // Handle the response
      if (response.ok) {
        const responseData = await response.json();
        console.log('Upload successful:', responseData["resultId"]);

        const response1 = await fetch('https://localhost:7178/png_to_any_download?ResultId=' + responseData["resultId"] , {
          method: 'GET'});

        //image download implementation
        const blob = await response1.blob(); // Convert to Blob (binary)
        const url = window.URL.createObjectURL(blob); // Create temporary URL
        console.log('Upload successful:', url);
        const a = document.createElement("a");
        a.href = url;
        a.download = "myfile.jpeg"; // 🔁 Set filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        // end implementation

        setUploadStatus(`Successfully uploaded ${selectedFiles.length} file(s)!`);
        setSelectedFiles([]);
        document.getElementById('multi-file-input').value = '';
      } else {
        // Try to get error details from response
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Unknown error';
        }
        console.error('Upload failed:', response.status, response.statusText, errorText);
        setUploadStatus(`Upload failed: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  // Clear all selected files
  const clearAllFiles = () => {
    setSelectedFiles([]);
    setUploadStatus('');
    document.getElementById('multi-file-input').value = '';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Uploader File</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          id="multi-file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Supported formats: Images only (Max 10MB per file)
        </div>
        
        {selectedFiles.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>Selected Files ({selectedFiles.length})</h3>
              <button
                onClick={clearAllFiles}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear All
              </button>
            </div>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    marginBottom: '5px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{file.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || uploading}
        style={{
          padding: '12px 24px',
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        {uploading ? 'Converting...' : `Convert ${selectedFiles.length} File(s)`}
      </button>

      {uploadStatus && (
        <div
          style={{
            padding: '12px',
            borderRadius: '4px',
            backgroundColor: uploadStatus.includes('Success') ? '#d4edda' : '#f8d7da',
            color: uploadStatus.includes('Success') ? '#155724' : '#721c24',
            border: `1px solid ${uploadStatus.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px'
          }}
        >
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader; 