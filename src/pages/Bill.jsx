import React, { useState } from "react";
import "./Bill.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const transactions = [
  { type: "task rewards", date: "2025-09-05 09:54:37", amount: "+ ₹10.00", category: "recharge" },
  { type: "withdrawal return", date: "2025-09-02 09:00:37", amount: "+ ₹7000.00", category: "withdrawal" },
  { type: "buy product", date: "2025-08-23 15:55:47", amount: "- ₹45", category: "recharge" },
  { type: "recharge", date: "2025-08-23 15:54:50", amount: "+ ₹500.00", category: "recharge" },
  { type: "task rewards", date: "2025-08-20 17:13:19", amount: "+ ₹10.00", category: "recharge" },
  { type: "buy product", date: "2025-08-20 17:11:35", amount: "- ₹200", category: "recharge" },
  { type: "recharge", date: "2025-08-20 05:24:18", amount: "+ ₹100.00", category: "recharge" },
  { type: "withdrawal return", date: "2025-09-02 09:05:32", amount: "+ ₹2000.00", category: "withdrawal" },
];

function Bill() {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filteredTransactions =
    activeTab === "all"
      ? transactions
      : transactions.filter((t) => t.category === activeTab);

  return (
    <div className="bill-page">
      {/* Header */}
      <div className="bill-header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="Black"/>
        </button>
        <h1>Balance Details</h1>
      </div>

      {/* Tabs */}
      <div className="bill-tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={activeTab === "recharge" ? "active" : ""}
          onClick={() => setActiveTab("recharge")}
        >
          Recharge
        </button>
        <button
          className={activeTab === "withdrawal" ? "active" : ""}
          onClick={() => setActiveTab("withdrawal")}
        >
          Withdrawal
        </button>
      </div>

      {/* Transactions */}
      <div className="bill-list">
        {filteredTransactions.map((tx, index) => (
          <div key={index} className="bill-card slide-up">
            <div className="bill-info">
              <h2>{tx.type}</h2>
              <p>{tx.date}</p>
            </div>
            <div
              className={`bill-amount ${
                tx.amount.includes("+") ? "positive" : "negative"
              }`}
            >
              {tx.amount}
            </div>
          </div>
        ))}
        <p className="end-text">No more</p>
      </div>
    </div>
  );
}

export default Bill;