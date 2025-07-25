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
    images: '',
    published: true,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      images: formData.images.split(',').map((url) => url.trim()),
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
          images: '',
          published: true,
        });
      } else {
        setMessage(`❌ ${data.error || 'Error occurred'}`);
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
      <input name="images" value={formData.images} onChange={handleChange} placeholder="Image URLs (comma-separated)" required />
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
