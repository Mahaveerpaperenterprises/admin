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

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('model_name', formData.model_name);
    form.append('brand', formData.brand);
    form.append('category_slug', formData.category_slug);
    form.append('price', formData.price || '');
    form.append('discountedPrice', formData.discountedPrice || '');
    form.append('description', formData.description);
    form.append('published', formData.published);

    const urlList = formData.imageUrls
      ? formData.imageUrls.split(',').map((url) => url.trim()).filter((url) => url)
      : [];

    urlList.forEach((url) => form.append('imageUrls', url));
    images.forEach((file) => form.append('images', file));

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: form,
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
        setImages([]);
      } else {
        setMessage(`❌ ${data.error || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error(err);
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
          <input name="imageUrls" value={formData.imageUrls} onChange={handleChange} placeholder="Image URLs (comma-separated)" />
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
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
