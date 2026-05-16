import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Password.css";
import { API_BASE_URL, } from "../api";
import Cookies from "js-cookie";


function ChangePassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !currentPassword || !newPassword) {
      return alert("Please fill all fields");
    }

    try {
      const res = await fetch(`${API_BASE_URL}api/users/Change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          type: "password",
          currentPassword,
          confirmPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password updated successfully! Pleas login");
        
                
                     Cookies.remove("2ndtredingWeb");
                   
                Cookies.set("2ndtredingWeb", data.token, { expires: 7, path: "/" });
                   
                
                //         // ✅ Save in localStorage
                        localStorage.setItem("userData", JSON.stringify(data.User));
  navigate("/login");
      } else {
        alert(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating password");
    }
  };

  return (
    <div className="password-container">
      <div className="password-header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="black" />
        </button>
        <h2>Change Password</h2>
      </div>

      <form className="password-card" onSubmit={handleSubmit}>
        <label className="input-label">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="password-input"
        />

        <label className="input-label">Current Password</label>
        <div className="password-input-wrapper">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="password-input"
          />
          <span
            className="toggle-visibility"
            onClick={() => setShowCurrent(!showCurrent)}
          ></span>
        </div>

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
      </form>
    </div>
  );
}

export default ChangePassword;
