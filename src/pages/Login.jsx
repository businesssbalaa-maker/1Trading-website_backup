import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { loginUser, SECRET_KEY } from "../api";
import "./Login.css";
import Password from "./Password";
import pako from "pako";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState(false);
  const navigate = useNavigate();

  const handleRegisterRedirect = () => navigate("/register");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!mobileNumber || !password) {
      alert("Phone and password are required");
      return;
    }

    const credentials = { phone: mobileNumber, password };

    try {
      Cookies.remove("2ndtredingWeb");
      Cookies.remove("2ndtredingWebUser");
      const response = await loginUser(credentials);

      if (response.token && response.user) {
        // ✅ 1. Convert to JSON string
        const jsonString = JSON.stringify(response.user);

        // ✅ 2. Compress and get Uint8Array
        const compressed = pako.deflate(jsonString);

        // ✅ 3. Convert compressed binary → Base64 string
        const compressedBase64 = btoa(String.fromCharCode(...compressed));

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

        alert(response.message || "Login successful");

        setTimeout(() => navigate("/"), 200);
      } else {
        alert("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="top-bar">
        <div className="logo-circle1">
          <img src="/logo.jpg" alt="Logo" className="logo-img" />
        </div>
      </div>

      <img
        src="https://i.pinimg.com/736x/21/fa/e8/21fae80dd33394b8c7622e6d136f9597.jpg"
        alt="real state"
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

      <div className="login-card">
        {password1 === false ? (
          <>
            <div className="card-header1">
              <h2 className="login-title">Login</h2>
              <button className="card-button" onClick={handleRegisterRedirect}>
                Register
              </button>
            </div>

            {/* ✅ Form wrapper added to remove DOM warning */}
            <form onSubmit={handleLogin} className="input-section">
              <div className="input-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <div className="input-box-container">
                  <span className="country-code">+91</span>
                  <input
                    type="text"
                    id="mobileNumber"
                    placeholder="Please enter your number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Please enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field-full"
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>
            </form>

            <div className="Forget22">
              <button
                className="register-link"
                onClick={() => setPassword1(true)}
              >
                Forget Password
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => setPassword1(false)}>
              Back To Login
            </button>
            <Password />
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
