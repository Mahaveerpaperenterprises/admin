import React, { useEffect, useState } from 'react';
import './Orders.css';
import AdminNavbar from './AdminNavbar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Failed to fetch orders');
          return;
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError('Failed to fetch orders: ' + err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-root">
      <AdminNavbar />
      <div className="orders-container">
        <h2 className="table-title">Orders</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="glass-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) =>
                  JSON.parse(order.items).map((item, index) => (
                    <tr key={`${order.order_id}-${index}`}>
                      <td>{order.order_id}</td>
                      <td>{order.date}</td>
                      <td>{item.name}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid #ccc',
                          }}
                        />
                      </td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>{order.payment_mode}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="7">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
