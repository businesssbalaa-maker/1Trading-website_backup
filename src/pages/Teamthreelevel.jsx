import React from "react";
import { useNavigate } from "react-router-dom";
import "./Teamthreelevel.css";

const TeamThreeLevel = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { id: "62******08", date: "2025-08-25 23:05:05", status: "Not Active" },
    { id: "70******51", date: "2025-08-25 22:45:04", status: "Not Active" },
    { id: "85******80", date: "2025-08-23 01:19:12", status: "Not Active" },
  ];

  return (
    <div className="teamthree-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          
          <h2>Team 3 Members</h2>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/teams")}>Teams</button>
          <button onClick={() => navigate("/account")}>Account</button>
        </div>
      </nav>

      {/* Header */}
      <header className="team-header">
        <h3>Referral (Valid/Total): <span>0/3</span></h3>
      </header>

      {/* Members List */}
      <section className="members-section">
        <h2>Team 3 Members List</h2>
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
      <footer className="footer">
        <p>© 2025 Vivo Trading Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TeamThreeLevel;