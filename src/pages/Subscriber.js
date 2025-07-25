/*import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './Subscriber.css';

function Subscriber() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://backend-tawny-one-62.vercel.app/api/subscribers')
      .then((res) => res.json())
      .then((records) => {
        const formatted = records.map((s, i) => ({
          id: i + 1,
          name: s.name,
          mobile: s.mobile,
          date: new Date(s.subscribed_at).toLocaleString(),
        }));
        setData(formatted.reverse());
      });
  }, []);

  return (
    <div className='subscribers'>
      <AdminNavbar />
    <div className="orders-container">
      <div className="orders-table-container">
        <h2 className="table-title">Subscribers</h2>
        <div className="glass-table">
          <table>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.mobile}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Subscriber; */