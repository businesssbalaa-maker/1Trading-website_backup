import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BankCard.css";
import { ArrowLeft } from "lucide-react";

export default function BankCardInfo() {
  const navigate = useNavigate();
  const [showBanks, setShowBanks] = useState(false);
  const [selectedBank, setSelectedBank] = useState("State Bank of India");

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IDBI Bank",
    "Kotak Mahindra Bank"
  ];

  return (
    <div className="bank-page">
      {/* Header */}
      <div className="header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="white"/>
        </button>
        <h1>Bank Card Info</h1>
      </div>

      {/* Card Info Section */}
      <div className="form-container">
        {/* Bank Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => setShowBanks(!showBanks)}
          >
            {selectedBank} <span className="arrow">▼</span>
          </button>

          {showBanks && (
            <div className="dropdown-list animate-fadeInDown">
              {banks.map((bank, i) => (
                <button
                  key={i}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedBank(bank);
                    setShowBanks(false);
                  }}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}
        </div>

        <input type="text" defaultValue="SBIN0004542" placeholder="IFSC Code" />
        <input
          type="text"
          defaultValue="Maghvendra Singh Parmar"
          placeholder="Account Holder Name"
        />
        <input
          type="text"
          defaultValue="39068760192"
          placeholder="Account Number"
        />
        <input type="password" placeholder="Trade Password" />

        <button className="edit-btn animate-bounce">Edit Bank Card</button>
      </div>

      {/* Info Section */}
      <div className="info-box animate-slideIn">
        <h2>Explain</h2>
        <p>1 - You can only add a bank card for withdrawals</p>
        <p>
          2 - Please ensure that the bank accounts are correct and functioning
          properly
        </p>
      </div>
    </div>
  );
}