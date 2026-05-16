import React from "react";
import { useNavigate } from "react-router-dom";
import "./Notice.css";
import { ArrowLeft } from "lucide-react";

export default function Notice() {
  const navigate = useNavigate();

  return (
    <div className="notice-page">
      {/* Header */}
      <div className="header">
        <button className="back-btnR" onClick={() => navigate(-1)}>
                  <ArrowLeft color="white"/>
                </button>
        <h1>Notice</h1>
      </div>

      {/* Notice Content */}
      <div className="notice-container">
        <p className="notice-text animate-fadeIn">No Notice yet</p>
      </div>
    </div>
  );
}