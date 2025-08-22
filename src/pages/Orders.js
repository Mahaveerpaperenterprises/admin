import React, { useEffect, useState } from "react";
import "./Orders.css";
import AdminNavbar from "./AdminNavbar";

const API_BASE = "https://mahaveerbe.vercel.app"; 

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (!res.ok) {
          setError((data && (data.error || data.message)) || "Failed to fetch orders");
          return;
        }

        const ordersArray = Array.isArray(data) ? data : data?.orders || [];

        const normalized = ordersArray.map((order) => {
          let items = [];
          if (Array.isArray(order.items)) {
            items = order.items;
          } else if (typeof order.items === "string") {
            try {
              const parsed = JSON.parse(order.items);
              items = Array.isArray(parsed) ? parsed : [];
            } catch {
              items = [];
            }
          }

          const itemsNorm = items.map((it) => ({
            product_name: it.product_name ?? it.name ?? "",
            image_url:
              it.image_url ??
              it.image ??
              (Array.isArray(it.images) ? it.images[0] : "") ??
              "",
            quantity:
              typeof it.quantity === "number"
                ? it.quantity
                : typeof it.qty === "number"
                ? it.qty
                : typeof it.quantity_ordered === "number"
                ? it.quantity_ordered
                : Number(it.quantity) || Number(it.qty) || 0,
            unit_price_minor:
              typeof it.unit_price_minor === "number"
                ? it.unit_price_minor
                : typeof it.price_minor === "number"
                ? it.price_minor
                : typeof it.price === "number"
                ? Math.round(it.price * 100)
                : typeof it.price === "string"
                ? Math.round(Number(it.price) * 100)
                : 0,
          }));

          return { ...order, items: itemsNorm };
        });

        setOrders(normalized);
      } catch (err) {
        setError("Failed to fetch orders: " + (err?.message || "Unknown error"));
      }
    };

    fetchOrders();
  }, []);

  const toMoney = (minor, cur) => {
    const v = typeof minor === "number" ? minor : Number(minor || 0);
    return `${(v / 100).toFixed(2)} ${cur || ""}`.trim();
  };

  const priceItem = (minor) => {
    const v = typeof minor === "number" ? minor : Number(minor || 0);
    return `₹${(v / 100).toFixed(2)}`;
  };

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
                <th>Customer</th>
                <th>Product</th>
                <th>Image</th>
                <th>Qty</th>
                <th>Item Price</th>
                <th>Order Total</th>
                <th>Payment</th>
                {/*<th>Status</th>
                <th>Fulfillment</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.flatMap((order) => {
                  const items = order.items || [];
                  if (items.length === 0) {
                    return (
                      <tr key={`${order.id}-empty`}>
                        <td>{order.id}</td>
                        <td>{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</td>
                        <td>{order.email || ""}</td>
                        <td colSpan={3}>No items</td>
                        <td></td>
                        <td>{toMoney(order.total_amount, order.currency)}</td>
                        <td>{order.payment_status}</td>
                        {/*<td>{order.order_status}</td>
                        <td>{order.fulfill_status}</td> */}
                      </tr>
                    );
                  }
                  return items.map((it, idx) => (
                    <tr key={`${order.id}-${idx}`}>
                      <td>{idx === 0 ? order.id : ""}</td>
                      <td>{idx === 0 ? (order.created_at ? new Date(order.created_at).toLocaleString() : "") : ""}</td>
                      <td>{idx === 0 ? (order.email || "") : ""}</td>
                      <td>{it.product_name || ""}</td>
                      <td>
                        {it.image_url && (
                          <img
                            src={it.image_url}
                            alt={it.product_name || "item"}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </td>
                      <td>{it.quantity ?? ""}</td>
                      <td>{priceItem(it.unit_price_minor)}</td>
                      <td>{idx === 0 ? toMoney(order.total_amount, order.currency) : ""}</td>
                      <td>{idx === 0 ? order.payment_status : ""}</td>
                      {/*<td>{idx === 0 ? order.order_status : ""}</td>
                      <td>{idx === 0 ? order.fulfill_status : ""}</td> */}
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan={11}>No orders available</td>
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
