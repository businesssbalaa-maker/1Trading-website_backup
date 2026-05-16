import React, { useMemo } from 'react';
import {  TrendingUp, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import "./VIP.css"
import { useLocation, useNavigate } from 'react-router-dom';
// --- VIP Tiers Data ---
// Updated to include the 'invites' requirement (currently 0 for all levels)
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

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
};

// --- Component for the Dynamic VIP Badge (Used as the 'Image') ---
export const VIPBadge = ({ levelData, size = 'large', isCurrent = false, isUnlocked = true }) => {
  
  // Ring classes are simplified to custom classes now
  const ringClass = isCurrent 
    ? 'ring-current-level' 
    : isUnlocked
    ? 'ring-unlocked'
    : 'ring-locked';

  // The color class is now dynamically constructed using the 'color' property from the data
  const colorClass = `badge-color-${levelData.color}`;

  return (
    <div
      className={`badge-base ${colorClass} ${size === 'large' ? 'badge-large' : 'badge-small'} ${ringClass}`}
    >
      <span className="badge-text-main">
        {levelData.badgeText}
      </span>
      {size === 'large' && (
        <span className="badge-star">
          ★
        </span>
      )}
    </div>
  );
};


// --- VIP Tier Gallery Component (Replaces the Table) ---
const VIPTierGallery = ({ currentInvestment, currentLevel }) => {
  return (
    <div className="card shadow-xl p-6">
      <h2 className="text-2xl-bold text-gray-800 mb-6">VIP Tier Roadmap</h2>
      
      {/* Vertical list of VIP Levels (Column Layout) */}
      <div className="list-column-container">
        {VIP_LEVELS.filter(v => v.level > 0).map((levelData) => {
          const isCurrent = levelData.level === currentLevel.level;
          const isUnlocked = currentInvestment >= levelData.investment;

          return (
            <div 
              key={levelData.level} 
              className={`list-item-base ${isCurrent ? 'list-item-current' : 'list-item-default'}`}
            >
              {/* LEFT: Badge and Name */}
              <div className="flex-align-center space-x-4">
                <VIPBadge 
                  levelData={levelData} 
                  size="small" 
                  isCurrent={isCurrent} 
                  isUnlocked={isUnlocked}
                />
                <p className="text-xl-bold text-gray-900">{levelData.name}</p>
              </div>

              {/* RIGHT: Investment and Status */}
              <div className="flex-col-end">
                <div className="text-right mb-1">
                  <span className="text-xs text-gray-500 font-medium-uppercase">
                    Required Investment
                  </span>
                  <p className="text-lg-semibold text-gray-700">
                    {formatCurrency(levelData.investment)}
                  </p>
                </div>
                
                {/* Status Indicator */}
                <div>
                  {isCurrent ? (
                    <span className="status-badge status-current">
                      <CheckCircle className="icon-sm mr-1"/> CURRENT LEVEL
                    </span>
                  ) : isUnlocked ? (
                    <span className="status-badge status-unlocked">
                      <CheckCircle className="icon-sm mr-1"/> UNLOCKED
                    </span>
                  ) : (
                    <span className="status-badge status-locked">
                      <Lock className="icon-sm mr-1"/> LOCKED
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main App Component ---
const VIP = () => {
  const navigate=useNavigate();

   const location = useLocation();
    const userData = location.state || {};
  const  currentInvestment =userData?.totalAmount?.totalRechargeAmount ||0 ;
  console.log(userData);
  // Memoize the calculation of current and next VIP level
  const { currentLevel, nextLevel } = useMemo(() => {
    let current = VIP_LEVELS[0];
    let next = VIP_LEVELS[1];

    // Find the current level
    for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
      if (currentInvestment >= VIP_LEVELS[i].investment) {
        current = VIP_LEVELS[i];
        // Determine the next level 
        next = i < VIP_LEVELS.length - 1 ? VIP_LEVELS[i + 1] : null;
        break;
      }
    }
    return { currentLevel: current, nextLevel: next };
  }, [currentInvestment]);

  // Calculate progress for the progress bar
  const progressData = useMemo(() => {
    if (!nextLevel) {
      return { percentage: 100, remaining: 0, baseInvestment: 0, targetInvestment: 0 }; // Max level reached
    }

    const prevInvestment = currentLevel.investment;
    const targetInvestment = nextLevel.investment;
    const requiredToNext = targetInvestment - prevInvestment;
    const investedSinceLast = currentInvestment - prevInvestment;
    const remaining = targetInvestment - currentInvestment;

    const percentage = requiredToNext > 0 ? Math.min(100, (investedSinceLast / requiredToNext) * 100) : 100;

    return { percentage, remaining, baseInvestment: prevInvestment, targetInvestment };
  }, [currentInvestment, currentLevel, nextLevel]);

  return (
    <>
      
      
      <div className="app-background">
        
        {/* --- APP HEADER (Fixed/Sticky) --- */}
        <div className="header2">
                <button className="back-btnR" onClick={() => navigate(-1)}>
                  <ArrowLeft color="black" />
                </button>
                <h1 className="header-title">VIP</h1>
                <div className="spacer"></div>
              </div>


        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="max-width-wrapper">
          
          {/* --- Current Status Card --- */}
          <div className="card shadow-2xl gradient-border-top">
            <div className="badge-base-wrapper">
              {/* The primary, large VIP badge */}
              <VIPBadge levelData={currentLevel} size="large" isCurrent={true} />
            </div>

            <div className="text-center md:text-left">
              <p className="text-2xl-bold text-gray-700">
                Current VIP Level: <span className="text-orange-700">{currentLevel.name}</span>
              </p>
              <p className="text-4xl-extrabold mt-2">
                {formatCurrency(currentInvestment)}
              </p>
              <p className="text-lg-normal text-gray-500">Total Account Investment</p>
            </div>
          </div>

          {/* --- Progress Bar Section --- */}
          <div className="card shadow-lg p-6">
            <h2 className="text-xl-bold text-gray-800 mb-4 flex-align-center">
              <TrendingUp className="icon-md mr-2 text-green-500" />
              {nextLevel ? `Progress to ${nextLevel.name}` : 'Maximum VIP Level Reached!'}
            </h2>

            <div className="progress-container">
              <div className="progress-label-container">
                <div className="progress-badge-start">
                  {currentLevel.name}
                </div>
                <div className="progress-badge-end">
                  {nextLevel ? nextLevel.name : 'MAX'}
                </div>
              </div>
              <div className="progress-bar-track">
                {/* NOTE: Progress bar width must remain an inline style due to dynamic calculation */}
                <div
                  style={{ width: `${progressData.percentage}%` }}
                  className={`progress-bar-fill ${nextLevel ? 'progress-fill-active' : 'progress-fill-max'}`}
                ></div>
              </div>
            </div>

            {nextLevel ? (
              <div className="text-center p-3 border-t border-gray-100 mt-2">
                <p className="text-lg-normal text-gray-600">
                  You need to invest{' '}
                  <span className="font-bold text-red-600">
                    {formatCurrency(progressData.remaining)}
                  </span>{' '}
                  more to unlock <span className="font-bold text-orange-700">{nextLevel.name}</span>!
                </p>
              </div>
            ) : (
              <p className="text-center text-lg-bold text-green-600">
                Congratulations! You've reached the highest VIP tier.
              </p>
            )}
          </div>
          
          {/* --- VIP Tier Gallery (Now a vertical list/column) --- */}
          <VIPTierGallery currentInvestment={currentInvestment} currentLevel={currentLevel} />

        </div>
      </div>
    </>
  );
};

export default VIP;
