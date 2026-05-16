import React, { useEffect, useState } from "react";
import {
 
  ChevronRight,
  User,
  Copy,
  ArrowLeft,
  AtSign,
  Phone,
  LogOut,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Wallet,

} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { VIPBadge } from "./VIP";
// --- Color and Style Constants ---
const YELLOW_ORANGE_GRADIENT =
  "linear-gradient(rgb(255, 201, 0), rgb(255, 153, 0))";
const BRIGHT_ORANGE = "#ff9900";
const ORANGE_SHADOW_COLOR = "rgba(255, 153, 0, 0.4)";

// Utility function for copying text using document.execCommand
const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
  document.body.removeChild(textarea);
};
const VIP_LEVELS = [
  { level: 0, name: 'V₀', investment: 0, invites: 0, badgeText: 'FREE', color: 'gray' },
  { level: 1, name: 'V₁', investment: 5000, invites: 0, badgeText: 'V1', color: 'slate' },
  { level: 2, name: 'V₂', investment: 10000, invites: 0, badgeText: 'V2', color: 'amber' },
  { level: 3, name: 'V₃', investment: 15000, invites: 0, badgeText: 'V3', color: 'blue' },
  { level: 4, name: 'V₄', investment: 19440, invites: 0, badgeText: 'V4', color: 'purple' },
  { level: 5, name: 'V₅', investment: 34440, invites: 0, badgeText: 'V5', color: 'pink' },
  { level: 6, name: 'V₆', investment: 64440, invites: 0, badgeText: 'V6', color: 'emerald' },
  { level: 7, name: 'V₇', investment: 144400, invites: 0, badgeText: 'V7', color: 'red' },
  { level: 8, name: 'V₈', investment: 180000, invites: 0, badgeText: 'V8', color: 'yellow' },
];
// Define all CSS styles as a single string
const STYLES = `
  :root {
    --bright-orange: ${BRIGHT_ORANGE};
    --orange-shadow: ${ORANGE_SHADOW_COLOR};
    --orange-gradient: ${YELLOW_ORANGE_GRADIENT};
  }
  
  /* Global Styles */
  .app-container {
    min-height: 100vh;
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', sans-serif;
  }
  .mainContent {
    width: 100%;

    
 
  }
  .content-padding {
    position: relative;
    z-index: 10;
    padding: 1rem;
    margin-bottom: 5rem;
  }

  /* Header Styles */
  .header-bg {
    height: 10rem;
    background-size: cover;
    background-position: center;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    overflow: hidden;
  }
  .logo-wrapper {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .logo-circle {
    background-color: white;
    padding: 0.25rem;
    border-radius: 9999px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }

  /* Profile Header Styles */
  .profile {
    background-color: white;
    padding: 1rem;
    margin-top: -5rem;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .user-icon-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
        justify-content: space-between;
    width: 100%;
    
  }
  .user-icon-border {
    position: relative;
    padding: 0.25rem;
    border: 2px solid var(--bright-orange);
    border-radius: 9999px;
  }
  .id-text {
    color: #1f2937;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .copy-btn {
    color: #9ca3af;
    transition: color 0.15s ease-in-out;
    padding: 0.25rem;
    border-radius: 9999px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  .new-tag {
    position: relative;
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: rotate(2deg);
    background: var(--orange-gradient);
  }
  .new-tag-arrow {
    position: absolute;
    top: 50%;
    left: -0.5rem;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 8px 0;
    border-color: transparent;
    border-right-color: var(--bright-orange);
  }

  /* Balance Summary Styles */
  .balance-card {
    background-color: white;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border-top: 4px solid var(--bright-orange);
  }
  .metrics-container {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }
  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }
  .metric-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  /* Services List Styles */
  .services-list-container {
    margin-bottom: 2rem;
  }
  .services-heading {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
    border-left: 4px solid var(--bright-orange);
    padding-left: 0.5rem;
  }
  .service-items-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Service Item Styles */
  .service-item {
    width: 100%;
    background-color: white;
    padding: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.15s ease-in-out;
    border: none;
    cursor: pointer;
  }
  .service-item:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  .service-item-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--bright-orange);
  }
  .service-item-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .service-item-text {
    font-size: 1.125rem;
    font-weight: 500;
    color: #374151;
  }
  .chevron-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
  }

  /* Sign Out Button Styles */
  .signout-btn {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    color: white;
    font-weight: 600;
    font-size: 1.125rem;
    border-radius: 0.75rem;
    margin-top: 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    background-color: var(--bright-orange); 
    box-shadow: 0 10px 15px -3px var(--orange-shadow), 0 4px 6px -4px var(--orange-shadow);
  }
  .signout-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .signout-btn:active {
    transform: scale(0.98);
  }
    /* Profile Detail Styles */
  .detail-card {
      background-color: white;
      padding: 1rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-top: 1rem;
  }
  .detail-item {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e5e7eb;
  }
  .detail-item:last-child {
      border-bottom: none;
  }
  .detail-icon {
      color: var(--bright-orange);
      margin-right: 1rem;
      width: 1.5rem;
      height: 1.5rem;
  }
  .detail-label {
      font-size: 0.875rem;
      color: #6b7280;
      width: 4rem; /* Fixed width for labels */
  }
  .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      flex-grow: 1;
      text-align: right;
  }
      
/* Financial Summary Grid */
.info-section1 {
  padding-bottom: 10px;
  border-top: 1px solid #eee;
}

.info-section1 h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 10px;
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 6px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

}

.summary-card {
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ddd;
   cursor: pointer;
  
}

.summary-card.orange {
  background: #fff6ec;
  border-color: #ffd3a6;
}

.summary-card.yellow {
  background: #fff8e6;
  border-color: #ffe7a6;
}

.summary-card.gray {
  background: #f9f9f9;
}

.summary-card p {
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.summary-card h3 {
  font-size: 1.3rem;
  margin-top: 5px;
  color: #333;
  font-weight: 700;
}

/* Button */
.footer-btn {
  padding: 5px;
}

.footer-btn button {
  width: 100%;
  padding: 12px;
  background: #ff7a00;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.footer-btn button:hover {
  background: #ff9500;
}


`;

// Main App component
const Profile = ({ userInfo, accountData }) => {
     const [user, setUser] = useState({
       phone: userInfo?.phone || "N/A",
        userId: userInfo?.userId || "-",
        referralCode: userInfo?.userInfo?.referralCode || "-",
        balance: userInfo?.updatedData?.balance || 0,
        pendingIncome: userInfo?.updatedData?.pendingIncome || 0,
        totalBuy: userInfo?.updatedData?.totalBuy || 0,
        withdrawal: userInfo?.updatedData?.Withdrawal || 0,
        registrationDate: userInfo?.userInfo?.registrationDate || new Date(),
       });
       
    const navigate=useNavigate();
  // Simple state to simulate page navigation
  const [activeScreen, setActiveScreen] = useState("home");
const accountpaloadData=[
    { label: "Total Buy", value: accountData.totalBuy },
    { label: "Product Income", value: accountData.productIncome },

    { label: "Pending Income", value: accountData.pendingIncome },
    { label: "Tasks Reward", value: accountData.tasksReward },
  ]
 
    const services = [
    { name: "Team", icon: "https://img.icons8.com/color/48/group.png", screen: "home", path: "/teams",userInfo},
    { name: "User Info", icon: "https://img.icons8.com/color/48/info.png", screen: "profit",path: "/info",userInfo },
    { name: "About", icon: "https://img.icons8.com/color/48/user.png", screen: "home",path: "/about",userInfo },
    { name: "VIP", icon: "https://img.icons8.com/color/48/vip.png", screen: "home",path: "/vip" ,userInfo},
    { name: "Trade Password", icon: "https://img.icons8.com/color/48/lock-2.png", screen: "home",path: "/tradepassword",userInfo},
    { name: "Change Password", icon: "https://img.icons8.com/color/48/key.png", screen: "home",path: "/ChangePassword",userInfo },
  ];
  useEffect(()=>{setUser({
         phone: userInfo?.phone || "N/A",
        userId: userInfo?.userId || "-",
        referralCode: userInfo?.userInfo?.referralCode || "-",
        balance: userInfo?.updatedData?.balance || 0,
        pendingIncome: userInfo?.updatedData?.pendingIncome || 0,
        totalBuy: userInfo?.updatedData?.totalBuy || 0,
        withdrawal: userInfo?.updatedData?.Withdrawal || 0,
        registrationDate: userInfo?.userInfo?.registrationDate || new Date(),
             })},[userInfo?.phone, userInfo?.updatedData?.Withdrawal, userInfo?.updatedData?.balance, userInfo?.updatedData?.pendingIncome, userInfo?.updatedData?.totalBuy, userInfo?.userId, userInfo?.userInfo?.referralCode, userInfo?.userInfo?.registrationDate]);

  return (
    <div className="app-container">
      {/* Inject the styles into the head of the document */}
      <style>{STYLES}</style>

      <div className="mainContent">
        {activeScreen !== "profit" ? (
          <>
            <HeaderBackground />
            <div className="content-padding">
              <ProfileHeader userId={userInfo.userId} userInfo={userInfo} />
              <BalanceSummary accountData={accountpaloadData} />
             
                   <section className="info-section1">
          <h2>Financial Summary</h2>
          <div className="grid">
            <div className="summary-card orange" onClick={()=>navigate("/RechargeHistory",{state:{data:userInfo.rechargeHistory,totalAmount:userInfo?.totalAmount?.totalRechargeAmount}})}>
              <p>
                <Wallet size={16} /> Balance 
            
              </p>
              <h3>₹{user.balance.toFixed(2)}</h3>
              <div className="footer-btn">
          <button>Recharge History</button>
        </div>
               
            </div>
            <div className="summary-card yellow"  onClick={()=>navigate("/orders",{state:userInfo?.withdrawHistory})}>
              <p>
                <ShoppingCart size={16} /> Total Orders
              </p>
              <h3>{accountData.ordersCount}</h3>
              <div className="footer-btn">
          <button>Orders History</button>
        </div>
            </div>
            <div className="summary-card orange" onClick={()=>navigate("/orders",{state:userInfo?.withdrawHistory})}>
              <p>
                < DollarSign size={16} /> Total Buy
              </p>
              <h3>₹{user.totalBuy.toFixed(2)}</h3>
             
               <div className="footer-btn">
          <button>Orders History</button>
        </div>
            </div>
            <div className="summary-card yellow" onClick={()=>navigate("/WithdrawHistory",{state:{data:userInfo?.withdrawHistory,totalAmount:userInfo?.totalAmount?.totalWithdrawAmount}})}>
              <p>
                <TrendingDown size={16} />Withdrawal
              </p>
              <h3>₹{user.withdrawal.toFixed(2)}</h3>
              <div className="footer-btn">
          <button>Withdrawal History</button>
        </div>
            </div>
          </div>
        </section>
              <ServicesList navigate={navigate}services={services} />
          

              <SignOutButton navigate={navigate}/>
            </div>
          </> 
        ) : (
          <ProfileDetail
            userInfo={userInfo}
            setActiveScreen={setActiveScreen}
          />
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

// Component for the background of the header area
const HeaderBackground = () => (
  <div
    className="header-bg"
    style={{
    backgroundImage: `url('https://i.pinimg.com/736x/21/fa/e8/21fae80dd33394b8c7622e6d136f9597.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "200px", // adjust as you like
  }}
  >
    <div className="logo-wrapper">
      {/* Placeholder for Britannia logo */}
      <div className="logo-circle">
        <img
          src="/logo.jpg"
          alt="Logo"
          style={{ width: "2rem", height: "2rem", borderRadius: "9999px" }}
        />
      </div>
    </div>
  </div>
);

// Component for the profile section (ID and New tag)
const ProfileHeader = ({userId,userInfo}) => {

  const displayLength = 7;
  const truncatedId =
    userId.length > displayLength
      ? userId.substring(0, displayLength) + ".."
      : userId;
const  currentInvestment =userInfo?.totalAmount?.totalRechargeAmount ||0 ;
   let current = VIP_LEVELS[0];
 for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
      if (currentInvestment >= VIP_LEVELS[i].investment) {
        current = VIP_LEVELS[i];
       
        break;
      }
    }
  // Memoize the calculation of current and next VIP level
 
  return (
    <div className="profile">
      <div className="user-icon-wrapper">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-around"}}>
   <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <div className="avatar">
          <img
  src="/avatar.jpg"
  alt="Profile"
  style={{
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fbbf24",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  
  }}
/>
        </div>

        {/* ID Display and Copy Button */}
        <div className="user-id-text-group">
          <span className="id-text">ID: {truncatedId}</span>
          <button
            onClick={() => copyToClipboard(userId)}
            className="copy-btn"
            title="Copy User ID"
          >
            <Copy style={{ width: "1rem", height: "1rem" }} />
          </button>
          
        </div></div>
        </div>
     <div style={{display:"flex",gap:"14px",alignItems:"center"}}><h3>VIP Level</h3><VIPBadge levelData={current} size="badge-small" isCurrent={true} /></div>
        
         
      </div>
    </div>
  );
};

// Component for the balance and income metrics
const BalanceSummary = ({ accountData }) => {
  const data = accountData;

  return (
    <div className="balance-card">
      <div className="metrics-container">
        {data.map((item, index) => (
          <div key={index} className="metric-item">
            <div className="metric-value">{item.value >= 1000000
    ? (item.value / 1000000).toFixed(1) + "M"
    : item.value >= 1000
    ? (item.value / 1000).toFixed(1) + "K"
    : item.value}</div>
            <div className="metric-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for the list of services
const ServicesList = ({ setActiveScreen,navigate,services }) => {



  return (
    <div className="services-list-container">
      <h3 className="services-heading">My Services</h3>
      <div className="service-items-wrapper">
        {services.map((service) => (
          <ServiceItem
            key={service.name}
            service={service}
            onClick={()=> {navigate(service.path,{state:service.userInfo})}}
            
          />
        ))}
      </div>
    </div>
  );
};

// Reusable component for a single service list item
const ServiceItem = ({ service, onClick }) => (
  <button onClick={onClick} className="service-item">
    <div className="service-item-content">
   
       <img className="service-item-icon" src={service.icon} alt={service.title} />
      <span className="service-item-text">{service.name}</span>
    </div>
    <ChevronRight className="chevron-icon" />
  </button>
);

// Component for the Sign Out button
const SignOutButton = ({navigate}) => (
  <button className="signout-btn" onClick={() => {Cookies.remove("2ndtredingWeb");
            Cookies.remove("2ndtredingWebUser");
            localStorage.removeItem("userData");
            navigate("/login");}}>
    <div className="signout-content">
      <LogOut style={{ width: "1.25rem", height: "1.25rem" }} />
      <span>Sign Out</span>
    </div>
  </button>

);

const ProfileDetail = ({ userInfo, setActiveScreen }) => {
  return (
    <div>
      <div className="profile-back-header">
        <button className="back-button" onClick={() => setActiveScreen("home")}>
          <ArrowLeft className="chevron-icon" style={{ color: "#1f2937" }} />
        </button>
        <h2>Profile Record</h2>
      </div>
      <div className="content-padding">
        <div className="detail-card">
          <DetailItem
            icon={AtSign}
            label="Username"
            value={userInfo.username}
          />
          <DetailItem icon={Phone} label="Number" value={userInfo.number} />
          <DetailItem
            icon={User}
            label="User ID"
            value={userInfo.userId}
            isCopyable={true}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable component for a single detail item
const DetailItem = ({ icon: Icon, label, value, isCopyable = false }) => {
  return (
    <div className="detail-item">
      <Icon className="detail-icon" />
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value}</span>
      {isCopyable && (
        <button
          onClick={() => copyToClipboard(value)}
          className="copy-btn"
          title="Copy Value"
          style={{ marginLeft: "0.5rem", color: BRIGHT_ORANGE }}
        >
          <Copy style={{ width: "1rem", height: "1rem" }} />
        </button>
      )}
    </div>
  );
};

export default Profile;
