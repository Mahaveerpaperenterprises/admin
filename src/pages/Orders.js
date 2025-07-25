import React, { useEffect, useState } from 'react';
import './Orders.css';
import AdminNavbar from './AdminNavbar';

function Orders() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const res = await fetch('https://backend-tawny-one-62.vercel.app/api/quotes');
        if (!res.ok) {
          const err = await res.json();
          setError(`❌ Backend Error: ${err.error || 'Unknown error'}`);
          return;
        }

        const quotes = await res.json();
        const filtered = quotes.filter(q =>
          q.name && q.email && q.phone && q.product_name && q.image_url
        );

        const formatted = filtered.map((q, i) => ({
          id: i + 1,
          name: q.name,
          phone: q.phone,
          email: q.email,
          product: q.product_name,
          model: q.product_brand,
          product_type: q.product_type,
          image: q.image_url,
        })).reverse();

        setData(formatted);
      } catch (err) {
        setError('❌ Failed to fetch quotes: ' + err.message);
      }
    };

    loadQuotes();
  }, []);

  return (
    <div className="orders-root">
      <AdminNavbar />
      <div className="orders-container">
        <div className="orders-table-container">
          <h2 className="table-title">Order Details</h2>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="glass-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Product Type</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.phone}</td>
                      <td>{row.email}</td>
                      <td>{row.model}</td>
                      <td>{row.product}</td>
                      <td>{row.product_type}</td>
                      <td>
                        <img
                          src={row.image}
                          alt={row.product}
                          className="thumbnail"
                          onClick={() => setPopupImage(row.image)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No valid orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {popupImage && (
          <div className="popup-overlay" onClick={() => setPopupImage(null)}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
              <span className="close-btn" onClick={() => setPopupImage(null)}>&times;</span>
              <img src={popupImage} alt="Enlarged" className="popup-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
