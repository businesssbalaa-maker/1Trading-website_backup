import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "./ProductInfo.css";
import Cookies from "js-cookie";
import pako from "pako";
import { API_BASE_URL2, BuyProduct, getUserInfo, SECRET_KEY } from "../api";

const encryptedUser = Cookies.get("2ndtredingWebUser");

// --- Sub-Components ---

// Popup-enabled Buy Card
const BuyCard = ({
  price,
  minShare,
  maxShare,
  dailyIncomePerShare,
  product,
  balance,
  user,
  isdailyClaim,
}) => {
  const isLocked = useRef(false);
  const navigate = useNavigate();
  const [shareCount, setShareCount] = useState(minShare);
  const [popup, setPopup] = useState({
    visible: false,
    success: false,
    message: "",
  });

  const totalIncome = product.cycleValue;
  const totalDailyIncome = shareCount * dailyIncomePerShare;
  const totalMoney = totalDailyIncome * totalIncome;
  const newPrice = price * shareCount;

  const handleBuy = async (shareCount, product, amount) => {
    
    if (amount > balance) {
      setPopup({
        visible: true,
        success: false,
        message: "❌ Insufficient balance.",
      });
      setTimeout(() => setPopup({ ...popup, visible: false }), 2500);
      return;
    }
    if (product.purchaseType === "One time buy" && shareCount > 1) {
      alert("Product is one time buy, quantity must be 1.");
      return;
    }
if (isLocked.current) return;
    isLocked.current = true;
 
    try {
      const res = await BuyProduct({
        userId: user?._id,
        quantity: shareCount,
        product,
        TotalAmount: amount,
      });

      if (res.data.success) {
        setPopup({
          visible: true,
          success: true,
          message: "✅ Purchase successful!",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setPopup({
          visible: true,
          success: false,
          message: res.data.message || "❌ Purchase failed!",
        });
      }
    } catch (err) {
      console.log(err.response.data.message);
      setPopup({
        visible: true,
        success: false,
        message: `❌ ${err.response.data.message ?? "Internal Error"}`,
      });
    } finally {
      setTimeout(() => {
        isLocked.current = false;
      }, 1000);
      setTimeout(() => setPopup({ ...popup, visible: false }), 2500);
    }
  };

  return (
    <div className="card">
      <h3 className="text-sm font-medium color-gray-500 margin-bottom-1">
        Price
      </h3>
      <p className="text-3xl font-bold color-orange-500 margin-bottom-4">
        ₹{newPrice.toFixed(2)}
      </p>

      <div className="flex-row border-top-1 padding-top-2 margin-bottom-6">
        <div className="flex-1 padding-right-4">
          <label className="block text-sm font-medium color-gray-500 margin-bottom-1">
            Buy Share
          </label>
          <div className="flex-row align-center space-x-2">
            <span className="text-lg font-bold color-gray-800">
              {shareCount}
            </span>
            <span className="badge-orange">{minShare}</span>
          </div>
          <input
            type="range"
            min={minShare}
            max={maxShare}
            value={shareCount}
            onChange={(e) => setShareCount(parseInt(e.target.value))}
            className="range-slider"
            style={{ accentColor: "#f97316" }}
          />
          <div className="flex-row justify-between text-xs color-gray-500 margin-top-1">
            <span>MIN {minShare}</span>
            <span>MAX {maxShare}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm color-gray-500">
            {product.cycleType === "hour" ? "Hourly Income" : "Daily Income"}
          </p>
          <p className="text-xl font-bold color-green-600">
            ₹{totalDailyIncome.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="flex-row justify-between align-center margin-top-6">
        <p className="text-lg font-medium color-gray-600">
          Total Income{" "}
          <span className="text-2xl font-bold color-gray-800">
            ₹{totalMoney}
          </span>
        </p>
        <button
          onClick={() => handleBuy(shareCount, product, newPrice)}
          className="button-primary"
        >
          Buy Now
        </button>
      </div>

      {popup.visible && (
        <div
          className={`popup-card ${
            popup.success ? "popup-success" : "popup-fail"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

// Detailed Info Cards
const DetailCards = ({
  price,
  duration,
  dailyIncome,
  totalIncome,
  needLevel,
  product,
  isdailyClaim,
}) => (
  <div className="space-y-6">
    <div className="card">
      <h2 className="text-xl font-bold color-gray-800 border-left-4 border-orange-500 padding-left-3 margin-bottom-4">
        Buy and upgrade vip1
      </h2>
      <div className="space-y-3 color-gray-700">
        <DetailRow
          label="Is Daily Claim Product"
          value={isdailyClaim}
          valueClassName="color-green-600 font-bold"
        />
        <DetailRow
          label="Price"
          value={`₹${price.toFixed(2)}`}
          valueClassName="color-orange-500 font-bold"
        />
        <DetailRow
          label="Revenue Duration"
          value={`${duration} Days`}
          valueClassName="color-green-600 font-bold"
        />
        <DetailRow
          label="Daily Income"
          value={`₹${dailyIncome.toFixed(1)}`}
          valueClassName="color-green-600 font-bold"
        />
        <DetailRow
          label="Need Level"
          value={
            <div className="flex-row align-center">
              <Zap className="icon-sm color-gray-500 margin-right-1" />
              {needLevel}
            </div>
          }
        />
        <DetailRow
          label="Total Income"
          value={`₹${totalIncome.toFixed(1)}`}
          valueClassName="color-gray-800 font-bold text-lg"
        />
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value, valueClassName = "color-gray-700" }) => (
  <div className="flex-row justify-between align-center text-base">
    <span className="color-gray-600">{label}</span>
    <span className={valueClassName}>{value}</span>
  </div>
);

// Main Component
export default function ProductInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state;
  const [explanations, setExplanations] = useState([]);
  const [balance, setbalance] = useState(0);
  const [user, setuser] = useState({});
  const dailyIncome =
    product.cycleType === "hour" ? product.hour : product.daily;
  const PRODUCT_MOCK_DATA = {
    price: product.price,
    minShare: 1,
    maxShare: 10,
    dailyIncomePerShare: dailyIncome,
    revenueDurationDays: product.cycleValue,
    productImageUrl: `${API_BASE_URL2}${product.imageUrl}`,
    needLevel: "VIP",
  };

  const totalIncome = useMemo(
    () =>
      PRODUCT_MOCK_DATA.dailyIncomePerShare *
      PRODUCT_MOCK_DATA.revenueDurationDays,
    []
  );

  const getUserData = async () => {
    if (encryptedUser) {
      const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");

      // 🔹 3. AES decrypt (gives compressed Base64 string)
      const decryptedBase64 = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      );
      if (!decryptedBase64) return null;

      // 🔹 4. Convert Base64 → Uint8Array (binary bytes)
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 🔹 5. Decompress (restore JSON string)
      const decompressed = pako.inflate(bytes, { to: "string" });
      const data = await JSON.parse(decompressed);
      setuser(data);
      if (data?._id) {
        const res = await getUserInfo(data._id);

        setbalance(res?.data?.users?.balance);
      } else {
        navigate("/login");
      }
    }
  };
  const fetchExplanations = async () => {
    if (product?.productExplanation)
      setExplanations(product.productExplanation);
  };
  useEffect(() => {
    getUserData();
    fetchExplanations();
  }, []);

  return (
    <div className="app-container">
      <header className="header2">
        <ChevronLeft
          className="w-6 h-6 color-gray-800"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-semibold color-gray-800">Buy Product</h1>
        <span>
          Balance <h3>{balance ?? 0}</h3>
        </span>
      </header>

      <main className="main-content">
        <div className="image-container">
          <img
            src={PRODUCT_MOCK_DATA.productImageUrl}
            alt="item"
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x300/e0f2ff/0369a1?text=Image+Not+Available";
            }}
          />
        </div>

        <div className="margin-bottom-6">
          <BuyCard
            price={PRODUCT_MOCK_DATA.price}
            minShare={PRODUCT_MOCK_DATA.minShare}
            maxShare={PRODUCT_MOCK_DATA.maxShare}
            dailyIncomePerShare={PRODUCT_MOCK_DATA.dailyIncomePerShare}
            product={product}
            balance={balance}
            user={user}
            isdailyClaim={product.isdailyClaim}
          />
        </div>

        <DetailCards
          price={PRODUCT_MOCK_DATA.price}
          duration={PRODUCT_MOCK_DATA.revenueDurationDays}
          dailyIncome={PRODUCT_MOCK_DATA.dailyIncomePerShare}
          totalIncome={totalIncome}
          needLevel={PRODUCT_MOCK_DATA.needLevel}
          product={product}
          isdailyClaim={product.isdailyClaim === true ? "Yes" : "No"}
        />
        <div className="explain-box">
          <h3>Explain</h3>
          <ol>
            {explanations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
        <div style={{ height: "2.5rem" }}></div>
      </main>
    </div>
  );
}
