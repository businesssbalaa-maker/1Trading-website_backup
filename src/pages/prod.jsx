import React from "react";
import { API_BASE_URL2 } from "../api";

const MetricItem = ({
  label,
  value,
  valueColor,
  isPrimary = false,
  isLarge = false,
}) => {
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 0.2rem 0 0.2rem",
    borderBottom: !isPrimary ? "1px solid #f3f4f6" : "none",
  };

  const labelStyle = {
    color: "#374151",
    fontWeight: "500",
    fontSize: isLarge ? "1.125rem" : "1rem",
  };

  let finalValueColor = "#1f2937";
  if (valueColor === "text-green-800") finalValueColor = "#000000ff";
  else if (valueColor === "text-green-600") finalValueColor = "#000000ff";
  else if (valueColor === "text-red-600") finalValueColor = "#000000ff";

 return (
  <div style={containerStyle}>
    <span style={labelStyle}>{label}</span>

    <span
      style={{
        fontWeight: "bold",
        fontSize: isLarge ? "1.1rem" : "1rem",
        color: finalValueColor,
      }}
    >
      {(() => {
        // Remove commas and convert to number
        const cleaned = (value || "").toString().replace(/,/g, "");
        const num = Number(cleaned);

        // If not a valid number, show raw string WITHOUT ₹ sign
        if (isNaN(num)) {
          return value; // directly show string value
        }

        // Otherwise, show formatted number WITH ₹ sign
        return (
          <>
            <span style={{ fontFamily: "sans-serif" }}>₹</span>
            {num >= 1000000
              ? (num / 1000000).toFixed(1) + "M"
              : num.toFixed(1)}
          </>
        );
      })()}
    </span>
  </div>
);

};

const ProductCard = ({ productData, onBuy }) => {
  const { title, price, dailyEarnings, totalGain, durationDays, cycleType,img,isdailyClaim } =
    productData;


  const cardStyle = {
    position: "relative",
    width: "100%",
minHeight:"33vh",
    background: "#ffffffff",
    borderRadius: "1.5rem",
     overflow: "hidden",
   
    transition: "transform 0.3s ease-in-out",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  border: "1px solid #898989",

  };

  const badgeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#f97316",
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "600",
    padding: "0.25rem 1rem",
    borderBottomRightRadius: "1rem",
    borderTopLeftRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  };

  return (
    <div style={cardStyle}>
      {/* Orange badge */}
      <div style={badgeStyle}>
        {durationDays} {cycleType === "hour" ? "Hours" : "Days"}
      </div>

      <div style={{ paddingLeft:".5rem",paddingRight:".5rem",paddingTop:".5rem" ,backgroundColor:"rgb(255 254 243)"}}>
        

        <div
          style={{
           
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          {/* Product image */}
          <div
            style={{
              flexShrink: 0,
              width: "100%",
              height: "18vh",
              backgroundColor: "#ebdcdcff",
              borderRadius: "1rem",
              
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            overflow: "hidden"
            }}
          >
            <img
               src={`${API_BASE_URL2}${img}`}
              alt="Product"
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/150x150/9ca3af/fff?text=Product";
              }}
            />
          </div>

      
          <div style={{ flexGrow: 1, paddingTop:".5rem"}}>
            <h3>     {title}</h3>
            
            <MetricItem
              label="Plan Price"
              value={price}
              valueColor="text-green-800"
              isPrimary
            />
            <MetricItem
              label= {cycleType === "hour" ? "Hours Earning" : "Days Earning"} 
              value={dailyEarnings}
              valueColor="text-green-600"
            />
            <MetricItem
              label="Total Earning"
              value={totalGain}
              valueColor="text-red-600"
              isPrimary
              isLarge
            />
          </div>
        </div>
      </div>

     
      <div
        style={{
          padding: "10px 0 8px 0",
          backgroundColor: "#fffef3",
          display: "flex",
          justifyContent: "center",
          
            
        }}
      >
        <button className="buy-button" onClick={onBuy}>
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
