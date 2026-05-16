import React, { useEffect, useState } from "react";
import {
  Home,
  DollarSign,
  User,
  Gift,
  Users,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { getUserInfo, SECRET_KEY, tokenVerify } from "../api";
import Support from "./Support";
import pako from "pako";
import PopupCard from "./PopupCard";
import LiveProof from "./LiveProofList";
const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [UserData, setUserData] = useState({});
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState("0");
  const [withdraw, setwithdraw] = useState("0");
  const [TeamSize, setTeamSize] = useState(0);
  const navigate = useNavigate();
  const fetchUser = async () => {
    const encryptedUser = Cookies.get("2ndtredingWebUser");
    const token = Cookies.get("2ndtredingWeb");
    if (encryptedUser) {
      try {
         
                  const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");
        
            // 🔹 3. AES decrypt (gives compressed Base64 string)
            const decryptedBase64 = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (!decryptedBase64) return null;
        
            // 🔹 4. Convert Base64 → Uint8Array (binary bytes)
            const binaryString = atob(decryptedBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
        
            // 🔹 5. Decompress (restore JSON string)
            const decompressed = pako.inflate(bytes, { to: "string" });
        const UserData = await JSON.parse(decompressed);

        if (!UserData?._id) {
          navigate("/login");
        }
         const res1 = await tokenVerify(token, UserData?.phone);
   try {
         
console.log(res1)
          if (res1.status === 200 && res1.data.success) {
            // ✅ Token valid, user data in res.data.data
        
          } else {
                    Cookies.remove("2ndtredingWeb");
            Cookies.remove("2ndtredingWebUser");
            localStorage.removeItem("userData");
            navigate("/login");
          }
        } catch (err) {
          console.error(err);

          // 🔹 If server returns 403 → token mismatch
          if (err.response?.status === 403) {
            // Clear cookies and local storage
            Cookies.remove("2ndtredingWeb");
            Cookies.remove("2ndtredingWebUser");
            localStorage.removeItem("userData");

            // Redirect to login
            navigate("/login");
          } else {
            // Optional: handle other errors
            alert("Session expired or server error.");
          }
        }



        setUserData(UserData);

        const res = await getUserInfo(UserData._id); // fetch user info
        console.log(res?.data?.users?.team1);
        setTeamSize(res?.data?.activeCount||0);
        setBalance(res?.data?.users?.balance || "0");
        setwithdraw(res?.data?.users?.Withdrawal||"0")
     
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []); // ✅ empty array ensures it runs only once

  const copyLink = () => {
    const link = `http://realstateinvest.in/register?invitation_code=${UserData.referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tabs = [
    { name: "Home", icon: <Home size={22} />, path: "/home" },
    { name: "invest", icon: <DollarSign size={22} />, path: "/invest" },

    { name: "Teams", icon: <Users size={22} />, path: "/teams" },
    { name: "Profile", icon: <User size={22} />, path: "/account" },
  ];

  const questRewards = [
    {
      id: 1,
      text: "Inviting activation of 20",
      reward: "₹ 1600.00",
      progress: { current: 4, total: 20 },
    },
    {
      id: 2,
      text: "Inviting activation of 70",
      reward: "₹ 5000.00",
      progress: { current: 4, total: 70 },
    },
    {
      id: 3,
      text: "Inviting activation of 200",
      reward: "₹ 13000.00",
      progress: { current: 4, total: 200 },
    },
    {
      id: 4,
      text: "Inviting activation of 500",
      reward: "₹ 50000.00",
      progress: { current: 4, total: 500 },
    },
    {
      id: 5,
      text: "Inviting activation of 2000",
      reward: "₹ 180000.00",
      progress: { current: 4, total: 2000 },
    },
    {
      id: 6,
      text: "Inviting activation of 5000",
      reward: "₹ 500000.00",
      progress: { current: 4, total: 5000 },
    },
    {
      id: 7,
      text: "Inviting activation of 10000",
      reward: "₹ 1000000.00",
      progress: { current: 4, total: 10000 },
    },
  ];

  return (
    <>
      <div>
        <div className="page-container">
          <div className="topbar1">
            <div className="logo-circle1">
              <img src="/logo.jpg" alt="Logo" className="logo-img" />
            </div>
          </div>

          {/* --- Wallet Card --- */}
          <div className="card1 wallet-card">
           
            <h3>Main Wallet</h3>
            <div className="wallet-info">
              <div>
                <p className="label">Your Balance</p>
                <p className="balance">
                  <span className="rupee"></span>₹{balance}
                </p>
              </div><div>
                <p className="label">Total Profit</p>
                <p className="balance">
                  <span className="rupee"></span>₹{withdraw}
                </p>
              </div>
              <Gift size={70} className="gift-icon" />
            </div>
            <div className="button-row">
              <button
                onClick={() => navigate("/recharge")}
                className="card-button"
              >
                Recharge
              </button>
              <button
                onClick={() => navigate("/withdraw")}
                className="card-button"
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* --- Icon Grid --- */}
          <div className="icon-grid">
            <div className="grid-item" onClick={() => navigate("/teams")}>
              <Users size={30} className="grid-icon" />
              <span>Teams</span>
            </div>

            <div className="grid-item" onClick={() => navigate("/orders")}>
              <ShoppingBag size={30} className="grid-icon" />
              <span>Orders</span>
            </div>
          </div>
 <PopupCard/>
          {/* --- Invitation Card --- */}
          <div className="card1 invitation-card">
            <div className="card-header">
              <h3>Invitation</h3>
              <button
                onClick={() => navigate("/teams")}
                className="link-button"
              >
                <div className="card-header">
                  <div>My team</div> <ArrowRight />
                </div>
              </button>
            </div>
            <div className="invite-info">
              <div className="profile-img">
                <img
                  src="https://img.freepik.com/free-vector/contact-concept-landing-page_52683-21298.jpg?semt=ais_hybrid&w=740"
                  alt="Invitation Icon"
                />
              </div>
              <div>
                <p className="label">Promotional Links</p>
                <p className="link-text">
                  http://realstateinvest.in/register?invitation_code=
                  {UserData.referralCode}
                </p>
              </div>
            </div>
            <button onClick={copyLink} className="full-button copy-button">
              {copied ? "Copied!" : "Copy Invitation Link"}
            </button>
          </div>

          {/* --- Lucky Draw --- */}
          <div className="card1 lucky-draw-card">
            <h3>Lucky Draw</h3>
            <p className="label">
              The lucky wheel keeps spinning with great gifts
            </p>
            <button
              onClick={() => navigate("/luckydraw", { state: UserData?._id })}
              className="full-button go-button"
            >
              Go
            </button>
          </div>



<LiveProof/>
          {/* --- Quest Rewards --- */}
          <div className="card1 quest-rewards-card">
            <h3>Quest Rewards</h3>
            {questRewards.map((quest) => (
              <div key={quest.id} className="quest-item">
                <div className="quest-icon-container">
                  <img
                    src="https://img.freepik.com/free-vector/young-couple-using-tablet_603843-987.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="Quest Icon"
                  />
                </div>
                <div className="quest-content">
                  <p className="quest-text">{quest.text}</p>
                  <div className="quest-progress-bar-container">
                    <div
                      className="quest-progress-bar-fill"
                      style={{
                        width: `${(TeamSize / quest.progress.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="quest-reward-info">
                  <p className="quest-reward">{quest.reward}</p>
                  <p className="quest-progress">
                    {TeamSize}/{quest.progress.total}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-navH">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`nav-item ${activeTab === tab.name ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.name);
                  navigate(tab.path);
                }}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Support />
      {/* --- Bottom Navigation --- */}
    </>
  );
};

export default HomePage;
