import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Clipboard,

  CalendarDays,
  Copy,
  ArrowLeft,
} from "lucide-react";
import "./Info.css";

const UserAvatar = () => {
  

  return (
    <div className="avatar">
      <img
  src="/avatar.jpg"
  alt="Profile"
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fbbf24",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  
  }}
/>

    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, monetary = false }) => {
  const displayValue = monetary
    ? `₹${value?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    : value || "N/A";

  return (
    <div className="detail-item">
      <div className="detail-label">
        <Icon size={18} className="detail-icon" />
        <span>{label}</span>
      </div>
      <span className={monetary ? "detail-value money" : "detail-value"}>
        {displayValue}
      </span>
    </div>
  );
};

function Info() {
 
const navigate= useNavigate();
  const [copiedKey, setCopiedKey] = useState(null);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    userId: "",
    referralCode: "",
    balance: 0,
    pendingIncome: 0,
    totalBuy: 0,
    withdrawal: 0,
    registrationDate: "",
  });
 const location = useLocation();
  const userData = location.state || {};
  console.log(userData)
  userData.rechargeHistory.type="Recharge History";userData.withdrawHistory.type="Withdraw History";
  useEffect(() => {
    if (userData) {
      setUser({
       
        phone: userData?.phone || "N/A",
        userId: userData?.userId || "-",
        referralCode: userData?.UserData?.referralCode || "-",
        balance: userData?.updatedData?.balance || 0,
        pendingIncome: userData?.updatedData?.pendingIncome || 0,
        totalBuy: userData?.updatedData?.totalBuy || 0,
        withdrawal: userData?.updatedData?.withdrawal || 0,
        registrationDate: userData?.UserData?.registrationDate || new Date(),
      });
    }
  }, []);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="info-container">
      <div className="infocard">
        
        <header className="info-header">
      
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="black" />
        </button>
       
     
          <UserAvatar  />
         
          <p className="member-date">
            <CalendarDays size={16} /> Member Since:{" "}
            {new Date(user.registrationDate).toLocaleDateString()}
          </p>

          <div className="user-id-box">
            <span className="label">USER ID</span>
            <div className="user-id-row">
              <span className="id-text">{user.userId}</span>
              <button
                onClick={() => handleCopy(user.userId, "userId")}
                className="copy-btn"
              >
                <Copy size={14} />
                {copiedKey === "userId" && <span className="copied">Copied!</span>}
              </button>
            </div>
          </div>
        </header>

        <section className="info-section">
          <h2>Account Details</h2>
          <DetailItem icon={Phone} label="Phone" value={user.phone} />

          <div className="detail-item">
            <div className="detail-label">
              <Clipboard size={18} className="detail-icon" />
              <span>Referral Code</span>
            </div>
            <div className="detail-value">
              <span>{user.referralCode}</span>
              <button
                onClick={() => handleCopy(user.referralCode, "referral")}
                className="copy-btn gray"
              >
                <Copy size={14} />
                {copiedKey === "referral" && (
                  <span className="copied green">Copied!</span>
                )}
              </button>
            </div>
          </div>
        </section>

       
        
      </div>
    </div>
  );
}

export default Info;
