import React, { useEffect, useMemo, useState } from 'react';
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
  const [navTree, setNavTree] = useState([]);
  const [mode, setMode] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [newSlug, setNewSlug] = useState('');

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/navlinks?t=${Date.now()}`);
        const menu = await res.json();
        setNavTree(menu);
      } catch {}
    };
    fetchNav();
  }, []);

  const { priceAfterB2B, priceAfterB2C } = useMemo(() => {
    const price = parseFloat(formData.price || '0') || 0;
    const dB2B = Math.min(Math.max(parseFloat(formData.discount_b2b || '0') || 0, 0), 100);
    const dB2C = Math.min(Math.max(parseFloat(formData.discount_b2c || '0') || 0, 0), 100);
    const priceAfterB2B = price ? +(price * (1 - dB2B / 100)).toFixed(2) : 0;
    const priceAfterB2C = price ? +(price * (1 - dB2C / 100)).toFixed(2) : 0;
    return { priceAfterB2B, priceAfterB2C };
  }, [formData.price, formData.discount_b2b, formData.discount_b2c]);

  const normalize = (v) =>
    String(v || '')
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
      if (Number.isNaN(asNumber) || asNumber < 0 || asNumber > 100) return;
    }
    if (name === 'category_slug') {
      const normalized = normalize(value);
      setFormData((prev) => ({ ...prev, [name]: normalized }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleCategoryInsert = async (leafSlug) => {
    try {
      const body = {
        category_slug: leafSlug,
        label: leafSlug,
      };
      if (selectedNode) body.parent_slug = selectedNode.slugKey;
      const resCategory = await fetch(`${API_BASE}/api/navlinks/add-category-slug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await resCategory.json().catch(() => ({}));
    } catch {}
  };

  const findNodeBySlugKey = (nodes, key) => {
    for (const n of nodes) {
      if (n.slugKey === key) return n;
      if (n.submenu) {
        const r = findNodeBySlugKey(n.submenu, key);
        if (r) return r;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const productCategory = mode ? normalize(newSlug) : normalize(formData.category_slug);
    if (!productCategory) {
      setMessage('❌ Category slug is required');
      return;
    }

    const priceNum = parseFloat(formData.price || '0');
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setMessage('❌ Price must be a non-negative number');
      return;
    }

    if (mode === 'open' && newSlug) await handleCategoryInsert(productCategory);
    if (mode === 'specific' && newSlug && selectedNode) await handleCategoryInsert(productCategory);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('model_name', formData.model_name);
    fd.append('brand', formData.brand);
    fd.append('category_slug', productCategory);
    fd.append('price', formData.price || '');
    fd.append('discount_b2b', formData.discount_b2b === '' ? '0' : String(formData.discount_b2b));
    fd.append('discount_b2c', formData.discount_b2c === '' ? '0' : String(formData.discount_b2c));
    fd.append('description', formData.description);
    fd.append('published', String(formData.published));
    if (formData.imageUrls) fd.append('imageUrls', formData.imageUrls);
    files.forEach((f) => fd.append('images', f));

    try {
      const res = await fetch(`${API_BASE}/api/products`, { method: 'POST', body: fd });
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
        setNewSlug('');
        setMode('');
        setSelectedNode(null);
      } else {
        setMessage(`❌ ${data.error || 'Error occurred'}`);
      }
    } catch {
      setMessage('❌ Server error');
    }
  };

  const renderNavOptions = (nodes, prefix = '') =>
    nodes.map((n) => (
      <React.Fragment key={n.slugKey}>
        <option value={n.slugKey}>{prefix + n.title}</option>
        {n.submenu && renderNavOptions(n.submenu, prefix + '—')}
      </React.Fragment>
    ));

  return (
    <div className='main-entry'>
      
      <AdminNavbar />
    <div className="addProduct-root">
      <div className="addProduct-container">
        <h2 className="addProduct-title">Add Product</h2>

        <div className="navlink-mode">
          <button
            type="button"
            className={mode === 'open' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => {
              setMode('open');
              setSelectedNode(null);
            }}
          >
            Open Header
          </button>
          <button
            type="button"
            className={mode === 'specific' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => setMode('specific')}
          >
            Specific Location
          </button>
          
          {/*<button
            type="button"
            className={!mode ? 'mode-btn active' : 'mode-btn'}
            onClick={() => {
              setMode('');
              setSelectedNode(null);
              setNewSlug('');
            }}
          >
            Existing Category Only
          </button> */}
        </div>

        {mode === 'open' && (
          <div className="new-navlink-form">
            <label>Category Slug</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(normalize(e.target.value))}
              placeholder="e.g. brushes"
            />
          </div>
        )}

        {mode === 'specific' && (
          <div className="specific-location-form">
            <label>Place Under</label>
            <select
              value={selectedNode?.slugKey || ''}
              onChange={(e) => setSelectedNode(findNodeBySlugKey(navTree, e.target.value))}
            >
              <option value="">Select location</option>
              {renderNavOptions(navTree)}
            </select>
            <label>Category Slug</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(normalize(e.target.value))}
              placeholder="e.g. resin-sheets"
            />
          </div>
        )}

        <form className="addProduct-form" onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input name="model_name" value={formData.model_name} onChange={handleChange} placeholder="Model Name" />
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required />

          {!mode && (
            <input
              name="category_slug"
              value={formData.category_slug}
              onChange={handleChange}
              placeholder="Existing Category Slug (e.g. brushes)"
              required
            />
          )}

          <div className="price-row">
            <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} placeholder="Base Price" required />
            <input name="discount_b2b" type="number" step="1" min="0" max="100" value={formData.discount_b2b} onChange={handleChange} placeholder="Discount % B2B" />
            <input name="discount_b2c" type="number" step="1" min="0" max="100" value={formData.discount_b2c} onChange={handleChange} placeholder="Discount % B2C" />
          </div>

          <div className="price-preview">
            <span><strong>Preview:</strong></span>
            <span> B2B: {priceAfterB2B ? `₹${priceAfterB2B}` : '-'}</span>
            <span> B2C: {priceAfterB2C ? `₹${priceAfterB2C}` : '-'}</span>
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="imageUrls" value={formData.imageUrls} onChange={handleChange} placeholder="Image URLs (comma-separated or single data URL)" />
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />

          <label className="published-checkbox">
            <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
            Published
          </label>

          <button type="submit" className="submit-btn">Submit Product</button>
        </form>

        {message && <p className="submit-message">{message}</p>}
      </div>
    </div>
    </div>
  );
}

export default AddProduct;
