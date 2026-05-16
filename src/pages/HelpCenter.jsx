import React from "react";
import { motion } from "framer-motion";
import "./HelpCenter.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Send, Headphones } from "lucide-react";

export default function HelpCenter() {
   const navigate = useNavigate();
  const helpOptions = [
    {
      id: 1,
      icon: <Headphones size={28} />,
      title: "Online service",
      description: "Working hours: 09:00-20:00",
    },
    {
      id: 2,
      icon: <Send size={28} />,
      title: "Telegram",
      description: "Follow our official telegram channel for the latest news and discounts.",
    },
    {
      id: 3,
      icon: <MessageCircle size={28} />,
      title: "Your deposit has not been received yet?",
      description:
        "After successfully charging your account, if the balance has not been entered into your account, please provide it here and customer service personnel will assist you in handling it!",
    },
  ];

  return (
    <div className="helpcenter-container">
      {/* Header */}
      <motion.header
        className="helpcenter-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-btnR" onClick={() => navigate(-1)}>
                  <ArrowLeft color="Black"/>
                </button>
        <h1>Help Center</h1>
      </motion.header>

      {/* Options */}
      <div className="help-options">
        {helpOptions.map((item, index) => (
          <motion.div
            key={item.id}
            className="help-card"
            initial={{ x: index % 2 === 0 ? -80 : 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon">{item.icon}</div>
            <div className="text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}



