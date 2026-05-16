import React, {  useState } from "react";
import { motion } from "framer-motion";
import "./Invest.css";
import { useNavigate } from "react-router-dom";
import { Home, Users, User, DollarSign, } from "lucide-react";
import ProductCard from "./prod";


const Invest = ({ products }) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Basic");  

  const tabs = [
    { name: "Home", icon: <Home size={22} />, path: "/home" },
    { name: "invest", icon: <DollarSign size={22} />, path: "/invest" },

    { name: "Teams", icon: <Users size={22} />, path: "/teams" },
    { name: "Profile", icon: <User size={22} />, path: "/account" },
  ];
  const [activeTab1, setActiveTab1] = useState("invest");

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getProducts = () => {
    switch (activeTab) {
      case "Basic":
        return products.filter(
          (item) => item.badge === "popular" || item.badge === "non"
        );

      case "Normal":
        return products.filter((item) => item.badge === "new");

      case "Vip":
        return products.filter((item) => item.badge === "limited");

      default:
        return products.filter(
          (item) => item.badge === "popular" || item.badge === "non"
        );
    }
  };
  const buyitem = async (product) => {
    navigate("/ProductInfo",{state:product})
    return;

  
  };
console.log(products)
  return (
    <>
      <div className="invest-page-container">
        {/* Background gradients */}
        <div className="background-gradient"></div>

        {/* Header */}
        <div className="header2">
             
              <h1 className="header-title">My Order</h1>
              <div className="spacer"></div>
            </div>

        {/* Tabs section */}
        <div className="tabs-container">
          {["Basic", "Normal", "Vip"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product list section */}
        <div className="product-list-container">
          {getProducts().map((product, index) => (
            <motion.div
              key={product._id}
              className="product-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              {/* Product Image */}

              <div className="product-details">   

<ProductCard
  productData={{
    img:product.imageUrl,
    title: product.productName,
    price: product.price,
    dailyEarnings:
      product.cycleType === "hour" ? product.hour : product.daily,
    totalGain:
      product.cycleType === "hour"
        ? product.totalIncomeHour
        : product.totalIncomeDay,
    durationDays: product.cycleValue,
    cycleType: product.cycleType,
    Claim:product.claim,
    isdailyClaim:product.isdailyClaim
  }}
  onBuy={() => buyitem(product)}  // ✅ pass buy action here
/>

              </div>

              {/* Buy button */}
            </motion.div>
          ))}
          
  
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navH">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`nav-item ${activeTab1 === tab.name ? "active" : ""}`}
            onClick={() => {
              setActiveTab1(tab.name);
              navigate(tab.path);
            }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Invest;
