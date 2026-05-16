import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import "./Support.css";
import { getSocialLinks } from "../api";

// ✅ Telegram logo (from Icons8)
const TELEGRAM_ICON_URL = "https://img.icons8.com/color/48/telegram-app--v1.png";



// ✅ Support icon (custom or fallback)
const SUPPORT_ICON_URL =
  "https://img.icons8.com/?size=100&id=RntMFwIniVlj&format=png&color=000000";

const SupportIcon = ({ className }) => {
  const [fail, setFail] = useState(false);
  return fail ? (
    <MessageCircle className={className} />
  ) : (
    <img
      src={SUPPORT_ICON_URL}
      alt="Support"
      onError={() => setFail(true)}
      className={className}
    />
  );
};

const Support = () => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [usernameLink, setUsernameLink] = useState("");
  const [groupLink, setGroupLink] = useState("");

  // ✅ Fetch dynamic links from backend
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getSocialLinks();
        if (data && data.length > 0) {
          setUsernameLink(data[0].telegramUsernameLink || "");
          setGroupLink(data[0].telegramGroupLink || "");
        }
      } catch (err) {
        console.error("Failed to fetch links:", err);
      }
    };
    fetchLinks();
  }, []);

  // ✅ Click-outside menu close logic
  useEffect(() => {
    const close = (e) => {
      if (
        open &&
        !btnRef.current.contains(e.target) &&
        !menuRef.current.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="support-container">
      {/* Floating Support Button */}
      <button
        ref={btnRef}
        className="support-btn"
        onClick={() => setOpen(!open)}
        title="Support Options"
      >
        <div className="support-btn-content">
          <SupportIcon className="support-icon" />
        </div>
        <div className="white-card">
          <h3>Support</h3>
        </div>
      </button>

      {/* Support Dropdown */}
      <div ref={menuRef} className={`support-menu ${open ? "show" : ""}`}>
        {/* Personal Chat */}
        <a
          href={usernameLink}
          target="_blank"
          rel="noreferrer"
          title="Chat with Support"
        >
          <MessageCircle size={40} style={{ paddingLeft: "10px" }} />
        </a>

        {/* Telegram Group */}
        <a
          href={groupLink}
          target="_blank"
          rel="noreferrer"
          title="Join Telegram Group"
        >
          <img
            src={TELEGRAM_ICON_URL}
            alt="Telegram"
            className="telegram-icon"
          />
        </a>
      </div>
    </div>
  );
};

export default Support;
