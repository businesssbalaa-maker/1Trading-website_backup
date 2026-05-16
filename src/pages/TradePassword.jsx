import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TradePassword.css";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { API_BASE_URL, sendOtp } from "../api";

function TradePassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // store OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [tradePassword, setTradePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTradePass, setShowTradePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

 const handleSendOtp = async () => {
     if (!phone) return alert("Please enter phone number");
 setLoading(true);
     try {
       const data = await sendOtp(phone);
       if (data.success) {
         setOtpSent(true);
         setGeneratedOtp(data?.data?.otp|| "123456"); // store OTP from API response
         alert("OTP sent successfully!");
       } else {
         alert(data?.data?.data?.message[0] || "Failed to send OTP");
       }
       
     } catch (err) {
       console.error(err);
       alert("Error sending OTP");
     }
     setLoading(false);
   };
  // ✅ Verify OTP (match with generatedOtp)
  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");

    // eslint-disable-next-line eqeqeq
    if (otp == generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified! You can now set new password.");
    } else {
      alert("Invalid OTP");
    }
  };

  // ✅ Update Trade Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tradePassword !== confirmPassword) return alert("⚠️ Passwords do not match!");
     try {
          const res = await fetch(`${API_BASE_URL}api/users/Change-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, type: "tradePassword", confirmPassword }),
          });
          const data = await res.json();
    
          if (data.success) {
            alert("tradePassword updated successfully!");
           navigate(-1);
          } else {
            alert(data.message || "Failed to update tradePassword");
          }
        } catch (err) {
          console.error(err);
          alert("Error updating tradePassword");
        }
  };

  return (
    <div className="trade-wrapper">
      <div className="trade-container">
        <div className="trade-header">
          <button className="back-btnO" onClick={() => navigate(-1)}>
            <ArrowLeft color="white" />
          </button>
          <h2>Update Trade Password</h2>
        </div>

        <form className="trade-card" onSubmit={handleSubmit}>
          {!otpSent && (
            <>
              <label className="input-label">Number</label>
              <div className="otp-wrapper">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Your number.."
                  className="trade-input"
                  required
                />
                <button
                  type="button"
                  className="send-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}

          {otpSent && !otpVerified && (
            <>
              <label className="input-label">Verification Code (OTP)</label>
              <div className="otp-wrapper">
                <input
                  type="tel"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="trade-input"
                />
                <button type="button" className="verify-btn" onClick={handleVerifyOtp}>
                  Verify
                </button>
              </div>
            </>
          )}

          {otpVerified && (
            <>
              <label className="input-label">New Trade Password</label>
              <div className="password-wrapper">
                <input
                  type={showTradePass ? "text" : "password"}
                  value={tradePassword}
                  onChange={(e) => setTradePassword(e.target.value)}
                  placeholder="Enter new trade password"
                  className="trade-input"
                  required
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowTradePass(!showTradePass)}
                >
                  {showTradePass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <label className="input-label">Confirm Trade Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm trade password"
                  className="trade-input"
                  required
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <button
                type="submit"
                className="update-btn"
                disabled={!tradePassword || tradePassword !== confirmPassword}
              >
                Update Trade Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default TradePassword;
