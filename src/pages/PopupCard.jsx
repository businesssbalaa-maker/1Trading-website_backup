import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Zap, TrendingUp, ChevronRight, ExternalLink } from 'lucide-react';

// Import from your actual API file
// import { getSocialLinks } from "../api"; 

const PopupCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupLink, setGroupLink] = useState("");

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                // Replace with actual API call: const data = await getSocialLinks();
                const data = [{ telegramGroupLink: "https://t.me/example" }]; 
                if (data && data.length > 0) {
                    setGroupLink(data[0].telegramGroupLink || "");
                }
            } catch (err) {
                console.error("Failed to fetch links:", err);
            }
        };
        fetchLinks();

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const alertStyles = `
        .alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 1rem;
        }
        
        .alert-card {
            background-color: #f9fafb;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            position: relative;
            padding: 1.5rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1f2937;
        }
        
        .alert-close-btn {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            color: #9ca3af;
            cursor: pointer;
            background: transparent;
            border: none;
            padding: 4px;
            display: flex;
            transition: color 0.2s;
        }
        .alert-close-btn:hover {
            color: #1f2937;
        }
        
        .alert-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            color: #f97316;
            margin-bottom: 0.75rem;
        }

        .alert-title {
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
            line-height: 1.2;
        }

        .alert-subtitle {
            font-size: 0.875rem;
            color: #4b5563;
            margin-bottom: 1.25rem;
        }
        
        .feature-row {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .feature-pill {
            flex: 1;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .pill-text {
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
            background: rgba(249, 115, 22, 0.05);
            padding: 0.5rem;
            border-radius: 0.375rem;
        }
        
        .alert-cta-btn {
            width: 100%;
            padding: 0.75rem;
            background: #f97316;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.9375rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 1rem;
        }

        .alert-cta-btn:hover {
            background: #ea580c;
        }

        .footer-note {
            margin-top: 0.75rem;
            font-size: 0.7rem;
            color: #6b7280;
            text-align: center;
        }
    `;

    if (!isOpen) return null;

    return (
        <div className="popup-wrapper">
            <style dangerouslySetInnerHTML={{ __html: alertStyles }} />

            <div className="alert-overlay">
                <div className="alert-card">
                    <button onClick={handleClose} className="alert-close-btn" aria-label="Close">
                        <X size={18} />
                    </button>

                    <div className="alert-header">
                        <ShieldCheck size={14} />
                        Verified Platform
                    </div>

                    <h2 className="alert-title">Realstate Investment</h2>
                    <p className="alert-subtitle">Professional property asset management.</p>

                    <div className="feature-row">
                        <div className="feature-pill">
                            <TrendingUp size={14} color="#f97316" />
                            <span className="pill-text">Founded 2022</span>
                        </div>
                        <div className="feature-pill">
                            <ExternalLink size={14} color="#f97316" />
                            <span className="pill-text">Early Access</span>
                        </div>
                    </div>

                    <div className="status-badge">
                        <Zap size={14} fill="#f97316" color="#f97316" />
                        Instant Deposit Processing
                    </div>
                    
                    <div className="status-badge">
                        <Zap size={14} fill="#f97316" color="#f97316" />
                        Instant Withdrawal Processing
                    </div>

                    <button
                        onClick={() => window.open(groupLink || "https://t.me/", "_blank")}
                        className="alert-cta-btn"
                    >
                        Join Telegram Portal
                        <ChevronRight size={18} />
                    </button>

                    <p className="footer-note">
                        Secure community for real-time market updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PopupCard;