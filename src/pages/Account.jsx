import React, { useState, useEffect } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  User,
  DollarSign,
 
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { API_BASE_URL, SECRET_KEY } from "../api";
import Profile from "./Profile";

import pako from "pako";

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  

  const [accountData, setAccountData] = useState({
    totalBuy: 0,
    productIncome: 0,
    pendingIncome: 0,
    tasksReward: 0,
    Withdrawal: 0,
    balance: 0,
    ordersCount: 0,
  });

  const [userInfo, setUserInfo] = useState({
    username: "",
    phone: "",
    userId: "",
    UserData:{},
    updatedData:{},
    purchaseHistory:[],
    rechargeHistory:[],
    withdrawHistory:[],
    totalAmount:{}
  });
let updatedData = {};

 
const fetchAccountData = async () => {
      try {
        // ✅ Step 1: Read encrypted user info from cookie
        const encryptedUser = Cookies.get("2ndtredingWebUser");
        if (!encryptedUser) {
          console.warn("No user cookie found — redirecting to login");
          navigate("/login");
          return;
        }

        // ✅ Step 2: Decrypt user data
    
        
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

         const UserData =await JSON.parse(decompressed);
     

        // ✅ Step 3: Set user info from cookie
        setUserInfo({
          phone: UserData.phone,
          userId: UserData._id ,
          UserData
        });
const userId=UserData.phone;
        // ✅ Step 4: Fetch account + purchase data from backend
        const [accountRes, purchaseRes] = await Promise.all([
            axios.get(`${API_BASE_URL}api/users/account_data`, { params: { userId } }),
          axios.get(`${API_BASE_URL}api/users/purchase`,{ params: { userId } }).catch(() => ({ data: [] })),
    ]);
// if(accountRes.status)
     
        if (accountRes.data.success) {updatedData = accountRes?.data?.data;

        updatedData.ordersCount = purchaseRes?.data?.data?.purchases
          ? purchaseRes?.data?.data?.purchases?.length
          : 0;
          
setUserInfo({
          phone: UserData.phone,
          userId: UserData._id ,
          UserData,updatedData,
purchaseHistory:purchaseRes?.data?.data?.purchases,
          rechargeHistory:purchaseRes?.data?.data?.rechargeHistory,
          withdrawHistory:purchaseRes?.data?.data?.withdrawHistory,
          totalAmount:{totalRechargeAmount:purchaseRes?.data?.totalRechargeAmount,  totalWithdrawAmount:purchaseRes?.data?.totalWithdrawAmount}
         
        });
        console.log(purchaseRes?.data?.data?.rechargeHistory)
      
        setAccountData(updatedData);}
      } catch (error) {
if(error?.response?.data?.message==="User not found"){navigate("/login")}
        console.log("Error fetching account data:", error?.response?.data);
        // ✅ Do not redirect, just show empty data
        setAccountData({
          totalBuy: 0,
          productIncome: 0,
          pendingIncome: 0,
          tasksReward: 0,
          Withdrawal: 0,
          balance: 0,
          ordersCount: 0,
        });
      } 
    };
     useEffect(() => {
    

  fetchAccountData()
  }, []);
  const tabs = [
    { name: "Home", icon: <Home size={22} />, path: "/home" },
    { name: "invest", icon: <DollarSign size={22} />, path: "/invest" },
    { name: "Teams", icon: <Users size={22} />, path: "/teams" },
    { name: "Profile", icon: <User size={22} />, path: "/account" },
  ];

 

  return (
    <div >
     
  <Profile userInfo={userInfo} accountData={accountData}/>
      <div className="bottom-nav">
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
  
  );
}

