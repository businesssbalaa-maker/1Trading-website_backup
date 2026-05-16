import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser, SECRET_KEY, sendOtpNoCheck } from "../api";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import "./Register.css";
import pako from "pako";
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- State ---
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [tradePassword, setTradePassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Auto fill referral code from URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const invite = params.get("invitation_code");
    if (invite) setRefCode(invite);
  }, [location.search]);

  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter your phone number");

    try {
      setLoading(true);
      const data = await sendOtpNoCheck(phone,);

      console.log("OTP Response:", data);

      if (data.success) {
        setOtpSent(true);
        setGeneratedOtp(data?.data?.otp || "123456");
        alert("OTP sent successfully!");
      } else {
        alert(data?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP ---
  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    if (otp == generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP");
    }
  };

  // --- Register ---
  const handleRegister = async () => {
    if (!otpVerified) return alert("Please verify OTP first");
    if (!password || !tradePassword)
      return alert("Password and Trade Password are required");

    const userData = {
      phone,
      password,
      tradePassword,
      refCode: refCode || null,
      otp,
    };

    try {
      setLoading(true);
      const response = await registerUser(userData);

      if (response.token) {
       

const jsonString = JSON.stringify(response.user);

      // ✅ 2. Compress and get Uint8Array
      const compressed = pako.deflate(jsonString);

      // ✅ 3. Convert compressed binary → Base64 string
      const compressedBase64 = btoa(
        String.fromCharCode(...compressed)
      );

      // ✅ 4. Encrypt compressed Base64
      const encryptedUser = CryptoJS.AES.encrypt(
        compressedBase64,
        SECRET_KEY
      ).toString();

      // ✅ 5. Make Base64URL safe (optional)
      const base64url = encryptedUser
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // ✅ 6. Store securely
      Cookies.set("2ndtredingWeb", response.token, { expires: 7, path: "/" });
      Cookies.set("2ndtredingWebUser", base64url, { expires: 7, path: "/" });

      localStorage.setItem("userData", JSON.stringify(response.user));

        alert(response.message || "Registered successfully!");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-container">
      <div id="top-bar"style={{    height: "135px"}}>
        <div className="logo-circle1">
              <img
              src="/logo.jpg"
              alt="Logo"
              className="logo-img"
               />
            </div>
      </div>

      <img
        src="/fe9af9f2fc1bb01a72b9e6dc233b320ba46ce7ff.png"
        alt="real estate"
        id="chart-img"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "94%",
          borderRadius: "20px",
          height: "200px",
        }}
      />

      <div id="card">
        <h2 id="register-title">Register</h2>

        {/* Phone + Send OTP */}
        <div id="input-group">
          <input
            type="text"
            placeholder="Please enter your number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpVerified}
          />
          <button
  onClick={handleSendOtp}
  disabled={loading || otpSent || otpVerified}
  style={{
    backgroundColor: otpVerified
      ? "#ffaf25ff" // green when verified
      : otpSent
      ? "#f59e0b" // yellow when sent
      : "#000000ff", // blue default
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "5px 14px",
    fontSize: "14px",
    cursor: loading || otpSent || otpVerified ? "not-allowed" : "pointer",
    opacity: loading || otpSent || otpVerified ? 0.6 : 1,
    transition: "all 0.2s ease-in-out",
    marginLeft: "8px",
  }}
>
  {loading ? "Sending..." : otpVerified ? "Verified" : "Send OTP"}
</button>

        </div>

        {/* OTP Input */}
       {otpSent && !otpVerified && (
  <div id="input-group">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      onClick={handleVerifyOtp}
      style={{
        backgroundColor: "#ffaf25ff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 14px",
        fontSize: "14px",
        cursor: "pointer",
        marginLeft: "8px",
      }}
    >
      Verify
    </button>
  </div>
)}


        {/* Password Fields (disabled until OTP verified) */}
        <div id="input-group">
          <input
            type="password"
            placeholder="Please enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!otpVerified}
          />
        </div>

        <div id="input-group">
          <input
            type="password"
            placeholder="Please enter your trade password"
            value={tradePassword}
            onChange={(e) => setTradePassword(e.target.value)}
            disabled={!otpVerified}
          />
        </div>

        <div id="input-group">
          <input
            type="text"
            placeholder="Enter Invitation Code"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            disabled={!otpVerified}
          />
        </div>

        <p id="login-text">
          Already have an account?{" "}
          <span id="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>

      <button
        id="Register-btn"
        onClick={handleRegister}
        disabled={!otpVerified || loading}
      >
        {loading ? "Please wait..." : "Register"}
      </button>
    </div>
  );
};

export default Register;
