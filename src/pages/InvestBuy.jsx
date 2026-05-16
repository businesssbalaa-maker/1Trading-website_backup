import React, { useState } from "react";
import { useLocation, useNavigate,  } from "react-router-dom";
import "./InvestBuy.css";

const InvestBuy = () => {
  const navigate = useNavigate();
 
  const location = useLocation();
  const product = location.state;

  const [shares, setShares] = useState(1);

  if (!product) {
    return <div>Product not found</div>;
  }

  const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ""));
  const totalMoney = priceValue * shares;

  const increaseShares = () => {
    if (shares < 10) setShares(shares + 1);
  };

  const decreaseShares = () => {
    if (shares > 1) setShares(shares - 1);
  };

  return (
    <div className="investbuy-container">
      {/* Header */}
      <header className="investbuy-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2 className="header-title">My Products</h2>
      </header>

      {/* Product Image */}
      <div className="product-image-box">
        <img src={product.img} alt={product.id} className="product-main-img" />
      </div>

      {/* Price Details */}
      <div className="price-box">
        <p>Price = <span className="highlight">{product.price}</span></p>
        <p>Buy Share = <span className="highlight">{shares}</span></p>
        <p>Daily Income = <span className="highlight">{product.daily}</span></p>

        <div className="buy-range">
          <span>Min</span>
          <button className="range-btn" onClick={decreaseShares}>-</button>
          <span className="highlight">{shares}</span>
          <button className="range-btn" onClick={increaseShares}>+</button>
          <span>Max</span>
        </div>

        <p>Total Money = <span className="highlight">₹{totalMoney}</span></p>
        <button className="buy-now-btn">Buy Now</button>
      </div>

      {/* Welfare Section */}
      <div className="info-card">
        <h3>{product.id} Welfare</h3>
        <p>Price <span>{product.price}</span></p>
        <p>Revenue Duration <span>{product.revenue}</span></p>
        <p>Daily Income <span>{product.daily}</span></p>
        <p>Need Level <span>VIP1</span></p>
        <p>Total Income <span>{product.total}</span></p>
      </div>

      {/* Daily Fund Section */}
      <div className="info-card">
        <h3>Daily Fund</h3>
        <p>The investment amount of this product is as low as <span>{product.price}</span></p>
        <p>Period = <span>{product.revenue}</span></p>
        <p>Total Income Obtained = <span>{product.total}</span></p>
      </div>
    </div>
  );
};

export default InvestBuy;