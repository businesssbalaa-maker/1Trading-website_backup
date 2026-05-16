import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./OrderDetails.css";

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="order-details-page">
        <header className="details-header">
          <button className="back-btnR" onClick={() => navigate(-1)}>
            <ArrowLeft color="white" />
          </button>
          <h1 className="details-title">Order Details</h1>
        </header>
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          No order data available.
        </p>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      {/* Header */}
      <header className="details-header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="white" />
        </button>
        <h1 className="details-title">{order.title}</h1>
      </header>

      {/* Order Summary */}
      <div className="details-card">
        <div className="details-row">
          <span className="label">Buy Share:</span>
          <span className="value">{order.buyShare}</span>
        </div>
        <div className="details-row">
          <span className="label">Days:</span>
          <span className="value">{order.days}</span>
        </div>
        <div className="details-row">
          <span className="label">Daily Income:</span>
          <span className="value">{order.dailyIncome}</span>
        </div>
        <div className="details-row">
          <span className="label">Total Income:</span>
          <span className="value">{order.totalIncome}</span>
        </div>
        <div className="details-row">
          <span className="label">Price:</span>
          <span className="value">{order.price}</span>
        </div>
        <div className="details-row">
          <span className="label">Revenue Period:</span>
          <span className="value">{order.revenue}</span>
        </div>
        <div className="details-row">
          <span className="label">Generated Income:</span>
          <span className="value">{order.generatedIncome}</span>
        </div>
        <div className="details-row">
          <span className="label">Estimate Income:</span>
          <span className="value">{order.estimateIncome}</span>
        </div>
        <div className="details-row">
          <span className="label">Status:</span>
          <span
            className={`status-tag ${
              order.status === "finish" ? "finish" : "normal"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Settlement History */}
      <div className="settlement-section">
        <h2>Settlement History</h2>
        {order.settlements && order.settlements.length > 0 ? (
          <ul className="settlement-list">
            {order.settlements.map((s, index) => (
              <li key={index} className="settlement-item">
                <span className="settlement-date">{s.date}</span>
                <span className="settlement-amount">{s.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-settlement">No settlements yet.</p>
        )}
      </div>
    </div>
  );
}