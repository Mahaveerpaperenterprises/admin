import React, { useMemo, useState } from 'react';
import './AddProduct.css';
import AdminNavbar from './AdminNavbar';

const API_BASE = 'https://mahaveerbe.vercel.app';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    model_name: '',
    brand: '',
    category_slug: '',
    price: '',
    discount_b2b: '',
    discount_b2c: '',
    description: '',
    imageUrls: '',
    published: true,
  });

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const { priceAfterB2B, priceAfterB2C } = useMemo(() => {
    const price = parseFloat(formData.price || '0') || 0;
    const dB2B = Math.min(Math.max(parseFloat(formData.discount_b2b || '0') || 0, 0), 100);
    const dB2C = Math.min(Math.max(parseFloat(formData.discount_b2c || '0') || 0, 0), 100);
    const priceAfterB2B = price ? +(price * (1 - dB2B / 100)).toFixed(2) : 0;
    const priceAfterB2C = price ? +(price * (1 - dB2C / 100)).toFixed(2) : 0;
    return { priceAfterB2B, priceAfterB2C };
  }, [formData.price, formData.discount_b2b, formData.discount_b2c]);

  const normalizeCategory = (v) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[\\/]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if ((name === 'discount_b2b' || name === 'discount_b2c') && value !== '') {
      const asNumber = Number(value);
      if (Number.isNaN(asNumber)) return;
      if (asNumber < 0 || asNumber > 100) return;
    }
    if (name === 'category_slug') {
      const normalized = normalizeCategory(value);
      setFormData((prev) => ({ ...prev, [name]: normalized }));
      return;
    }
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
    setMessage('');
    const priceNum = parseFloat(formData.price || '0');
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setMessage('❌ Price must be a non-negative number');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('model_name', formData.model_name);
    fd.append('brand', formData.brand);
    fd.append('category_slug', formData.category_slug);
    fd.append('price', formData.price || '');
    fd.append('discount_b2b', formData.discount_b2b === '' ? '0' : String(formData.discount_b2b));
    fd.append('discount_b2c', formData.discount_b2c === '' ? '0' : String(formData.discount_b2c));
    fd.append('description', formData.description);
    fd.append('published', String(formData.published));
    if (formData.imageUrls) {
      fd.append('imageUrls', formData.imageUrls);
    }
    files.forEach((f) => fd.append('images', f));

    try {
      const resCategory = await fetch(`${API_BASE}/api/navlinks/add-category-slug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_slug: formData.category_slug,
          label: formData.category_slug,
        }),
      });
      await resCategory.json().catch(() => ({}));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage('✅ Product added successfully');
        setFormData({
          name: '',
          model_name: '',
          brand: '',
          category_slug: '',
          price: '',
          discount_b2b: '',
          discount_b2c: '',
          description: '',
          imageUrls: '',
          published: true,
        });
        setFiles([]);
      } else {
        setMessage(`❌ ${data.error || 'Error occurred'}`);
      }
    } catch {
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
          <input
            name="category_slug"
            value={formData.category_slug}
            onChange={handleChange}
            placeholder="Category Slug (e.g. brushes)"
            required
          />
          <div className="price-row">
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Base Price"
              required
            />
            <input
              name="discount_b2b"
              type="number"
              step="1"
              min="0"
              max="100"
              value={formData.discount_b2b}
              onChange={handleChange}
              placeholder="Discount % for B2B"
              title="Percentage discount for B2B customers (0–100)"
            />
            <input
              name="discount_b2c"
              type="number"
              step="1"
              min="0"
              max="100"
              value={formData.discount_b2c}
              onChange={handleChange}
              placeholder="Discount % for B2C"
              title="Percentage discount for B2C customers (0–100)"
            />
          </div>
          <div className="price-preview">
            <span>
              <strong>Preview :</strong>:
            </span>
            <span> B2B: {priceAfterB2B ? `₹${priceAfterB2B}` : '-'}</span> ,
            <span> B2C: {priceAfterB2C ? `₹${priceAfterB2C}` : '-'}</span>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            name="imageUrls"
            value={formData.imageUrls}
            onChange={handleChange}
            placeholder="Image URLs (comma-separated or single data URL)"
          />
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
