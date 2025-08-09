import React, { useState } from 'react';
import './AddProduct.css';
import AdminNavbar from './AdminNavbar';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    model_name: '',
    brand: '',
    category_slug: '',
    price: '',
    discountedPrice: '',
    description: '',
    imageUrls: '',
    published: true,
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('model_name', formData.model_name);
    fd.append('brand', formData.brand);
    fd.append('category_slug', formData.category_slug);
    fd.append('price', formData.price || '');
    fd.append('discountedPrice', formData.discountedPrice || '');
    fd.append('description', formData.description);
    fd.append('published', String(formData.published));

    if (formData.imageUrls) {
      fd.append('imageUrls', formData.imageUrls);
    }
    files.forEach((f) => fd.append('images', f));

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Product added successfully');
        setFormData({
          name: '',
          model_name: '',
          brand: '',
          category_slug: '',
          price: '',
          discountedPrice: '',
          description: '',
          imageUrls: '',
          published: true,
        });
        setFiles([]);
      } else {
        setMessage(`❌ ${data.error || 'Error occurred'}`);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="addProduct-root">
      <AdminNavbar />
      <div className="addProduct-container">
        <h2 className="addProduct-title">Add Product</h2>
        <form className="addProduct-form" onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input name="model_name" value={formData.model_name} onChange={handleChange} placeholder="Model Name" />
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required />
          <input name="category_slug" value={formData.category_slug} onChange={handleChange} placeholder="Category Slug" required />
          <div className="price-row">
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" />
            <input name="discountedPrice" type="number" step="0.01" value={formData.discountedPrice} onChange={handleChange} placeholder="Discounted Price" />
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="imageUrls" value={formData.imageUrls} onChange={handleChange} placeholder="Image URLs (comma-separated or single data URL)" />
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <label className="published-checkbox">
            <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
            Published
          </label>
          <button type="submit">Submit Product</button>
        </form>
        {message && <p className="submit-message">{message}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
