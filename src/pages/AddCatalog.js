/* import React, { useState, useRef } from 'react';
import './AddCatalog.css';
import AdminNavbar from './AdminNavbar';

export default function AddCatalog() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);          
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const imageInputRef = useRef();                     
  const uploadBoxRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!title || !file || file.type !== 'application/pdf') {
      setError('❌ Title and a valid PDF file are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    if (image) formData.append('image', image);       

    try {
      setUploading(true);
      const res = await fetch('https://backend-tawny-one-62.vercel.app/api/catalogs', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        if (contentType?.includes('application/json')) {
          const err = await res.json();
          setError(err.error || '❌ Failed to upload catalog');
        } else {
          const errText = await res.text();
          setError('❌ Failed to upload catalog: ' + errText);
        }
        return;
      }

      setSuccess('✅ Catalog uploaded successfully!');
      setTitle('');
      setFile(null);
      setImage(null);                                
      fileInputRef.current.value = '';
      imageInputRef.current.value = '';               
    } catch (err) {
      console.error(err);
      setError('❌ Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile || droppedFile.type !== 'application/pdf') {
      setError('❌ Only PDF files are allowed');
      return;
    }
    setFile(droppedFile);
    setError('');
    uploadBoxRef.current.classList.remove('dragover');
  };
  const handleDragOver = (e) => { e.preventDefault(); uploadBoxRef.current.classList.add('dragover'); };
  const handleDragLeave = () => uploadBoxRef.current.classList.remove('dragover');

  return (
    <div>
      <AdminNavbar />
      <div className="add-catalog-page">
        <div className="add-catalog-container">
          <h2 className="add-catalog-title">Upload New Catalog PDF</h2>

          {success && <div className="success-msg">{success}</div>}
          {error   && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="add-catalog-form">
            <input
              type="text"
              placeholder="Catalog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* PDF upload box */
            /*<div
              className="upload-box"
              ref={uploadBoxRef}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? file.name : 'Drag & drop PDF or click to upload'}
              <input
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected?.type !== 'application/pdf') {
                    setError('❌ Only PDF files are allowed');
                    return;
                  }
                  setFile(selected);
                  setError('');
                }}
              />
            </div>

            {/* NEW: Image upload box */
            /*<div 
              className="upload-box"
              onClick={() => imageInputRef.current.click()}
            >
              {image ? image.name : 'Click to upload a cover image (optional)'}
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                ref={imageInputRef}
                onChange={(e) => {
                  const img = e.target.files[0];
                  if (img && !['image/png','image/jpeg'].includes(img.type)) {
                    setError('❌ Only JPEG/PNG images are allowed');
                    return;
                  }
                  setImage(img);
                  setError('');
                }}
              />
            </div>

            <button className="submit-btn" type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Catalog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
*/