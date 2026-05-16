import React from "react";
import "./BuyUpgradeVIP1.css";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function BuyUpgradeVIP1() {
   const navigate = useNavigate();
  return (
    <div className="buyupgrade-container">
      {/* Header */}
      <header className="buyupgrade-header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="white"/>
        </button>
        <h1>My Products</h1>
      </header>

      {/* Product Card */}
      <section className="product-card">
        <div className="product-header">
          <h2>Buy & Upgrade VIP 1</h2>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
            alt="gold-icon" 
            className="product-icon"
          />
        </div>

        <div className="info-box">
          <p><span>Price</span> ₹280.00</p>
          <p><span>Revenue</span> 42 Days</p>
          <p><span>Buy Share</span> 1</p>
          <p><span>Generated Income</span> ₹4132.80</p>
          <p><span>Estimate Income</span> ₹9643.20</p>
        </div>
      </section>

      {/* Settlement Records */}
      <section className="settlement-card">
        <h3>Settlement Records</h3>
        <div className="record-row"><p>2025-08-19</p><p className="amount">₹229.60</p></div>
        <div className="record-row"><p>2025-08-20</p><p className="amount">₹229.60</p></div>
        <div className="record-row"><p>2025-08-21</p><p className="amount">₹229.60</p></div>
        <div className="record-row"><p>2025-08-22</p><p className="amount">₹229.60</p></div>
        <div className="record-row"><p>2025-08-23</p><p className="amount">₹229.60</p></div>
        <div className="record-row"><p>2025-08-24</p><p className="amount">₹229.60</p></div>

        <div className="record-footer">
          <p>₹4132.80 <small>Total Income</small></p>
          <button className="normal-btn">Normal</button>
        </div>
      </section>
    </div>
  );
}