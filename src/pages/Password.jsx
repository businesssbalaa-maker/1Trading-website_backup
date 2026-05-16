import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Password.css";
import { API_BASE_URL, SECRET_KEY, sendOtp } from "../api";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import pako from "pako";
function Password() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState(0);

  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter phone number");

    try {
      const data = await sendOtp(phone);

      if (data.success) {
        setOtpSent(true);
        setGeneratedOtp(data?.data?.otp || "123456");
        alert("OTP sent successfully!");
      } else {
        alert(data?.data?.data?.message[0] || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");

    if (otp == generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified! You can now set new password.");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Enter new password");

    try {
      const res = await fetch(`${API_BASE_URL}api/users/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          type: "password",
          confirmPassword: newPassword,
        }),
      });
      const data = await res.json();

      if (data.token && data.user) {
        const jsonString = JSON.stringify(data.user);

        const compressed = pako.deflate(jsonString);

        const compressedBase64 = btoa(String.fromCharCode(...compressed));

        const encryptedUser = CryptoJS.AES.encrypt(
          compressedBase64,
          SECRET_KEY,
        ).toString();

        const base64url = encryptedUser
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        Cookies.set("tredingWeb", data.token, { expires: 7, path: "/" });
        Cookies.set("tredingWebUser", base64url, { expires: 7, path: "/" });

        localStorage.setItem("userData", JSON.stringify(base64url));

        alert(data.message || "Login successful");

        setTimeout(() => {
          navigate("/home");
        }, 200);
      } else {
        alert(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating password");
    }
  };

  return (
    <div className="">
      <form className="password-card" onSubmit={handleSubmit}>
        {!otpSent && (
          <>
            <label className="input-label">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="password-input"
            />
            <button
              type="button"
              className="update-btn"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && !otpVerified && (
          <>
            <label className="input-label">Enter OTP</label>
            <input
              type="tel"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="password-input"
            />
            <button
              type="button"
              className="update-btn"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        {otpVerified && (
          <>
            <label className="input-label">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="password-input"
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowNew(!showNew)}
              ></span>
            </div>
            <button type="submit" className="update-btn">
              Update Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Password;
