import React from "react";
import { useNavigate } from "react-router-dom";
import "./Teamonelevel.css";

const TeamOneLevel = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { id: "91******85", date: "2025-02-09 14:26:36", status: "Not Active" },
    { id: "62******19", date: "2025-08-29 19:18:27", status: "Active" },
    { id: "96******10", date: "2025-08-28 17:31:36", status: "Not Active" },
    { id: "77******53", date: "2025-08-24 22:22:02", status: "Active" },
    { id: "70******23", date: "2025-08-20 23:39:34", status: "Active" },
    { id: "87******43", date: "2025-08-19 19:14:50", status: "Active" },
  ];

  return (
    <div className="teamone-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          
          <h2>Team 1 Members</h2>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/teams")}>Teams</button>
          <button onClick={() => navigate("/account")}>Account</button>
        </div>
      </nav>

      {/* Header */}
      <header className="team-header">
        <h3>Referral (Valid/Total): <span>4/6</span></h3>
      </header>

      {/* Members List */}
      <section className="members-section">
        <h2>Team 1 Members List</h2>
        <div className="members-list">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className={`member-card ${member.status === "Active" ? "active" : "inactive"}`}
            >
              <div className="member-info">
                <p className="member-id">{member.id}</p>
                <p className="member-date">{member.date}</p>
              </div>
              <div className={`status-box ${member.status === "Active" ? "green" : "red"}`}>
                {member.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
};

export default TeamOneLevel;