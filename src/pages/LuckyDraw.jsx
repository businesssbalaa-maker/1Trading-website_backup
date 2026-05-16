import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import {
  checkLuckySpinValidation,
  createLuckySpin,
  fetchLuckySpinPrizes,
  getLuckySpinData,
  spinItem,
} from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const mockWinnings = [];

const Reel = ({ prizes, isSpinning, finalValue }) => {
  const [position, setPosition] = useState(0);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const itemHeight = 192; // 12rem = 192px

  useEffect(() => {
    if (isSpinning) {
      const duration = 4000;
      const totalRotations = prizes.length * 5;
      const targetPosition = (totalRotations + finalValue) * itemHeight;

      startTimeRef.current = performance.now();

      const animateReel = (currentTime) => {
        const elapsedTime = currentTime - startTimeRef.current;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentPosition = easedProgress * targetPosition;
        setPosition(-currentPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateReel);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateReel);
    } else {
      setPosition(-finalValue * itemHeight);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, finalValue, prizes.length, itemHeight]);

  const extendedPrizes = [
    ...prizes,
    ...prizes,
    ...prizes,
    ...prizes,
    ...prizes,
    ...prizes,
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${position}px)`,
        }}
      >
        {extendedPrizes.map((prize, index) => (
          <div
            key={index}
            style={{
              flexShrink: 0,
              width: "12rem",
              height: "12rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "1rem",
              margin: "6px",
            }}
          >
            <img
              src={prize.image}
              alt={prize.name}
              style={{
                width: "6rem",
                height: "6rem",
                borderRadius: "9px",
                marginBottom: "1rem",
              }}
            />
            <h2 style={{ color: "#1f2937", fontWeight: "bold" }}>
              {prize.name}
            </h2>
            <h3 style={{ color: "#d97706", fontWeight: "bold" }}>
              {prize.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const PrizeModal = ({ prize, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    }}
  >
    <div
      style={{
        backgroundColor: "#fef3c7",
        padding: "2rem",
        borderRadius: "1.5rem",
        textAlign: "center",
        maxWidth: "20rem",
        width: "90%",
      }}
    >
      <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
        🎉 Congratulations!
      </h3>
      <p style={{ marginBottom: "1rem" }}>You have won:</p>
      <img
        src={prize.image}
        alt={prize.name}
        style={{
          width: "6rem",
          height: "6rem",
          borderRadius: "50%",
          marginBottom: "1rem",
        }}
      />
      <h2 style={{ fontWeight: "bold", color: "#1f2937" }}>{prize.name}</h2>
      <p
        style={{ color: "#d97706", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        {prize.value}
      </p>
      <button
        onClick={onClose}
        style={{
          padding: "0.75rem 2rem",
          backgroundColor: "#f59e0b",
          color: "white",
          borderRadius: "9999px",
          fontWeight: "bold",
        }}
      >
        OK
      </button>
    </div>
  </div>
);

const LuckyDraw = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state || {};
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(0);
  const [winnings, setWinnings] = useState(mockWinnings);
  const [IsLuckyAllow, setIsLuckyAllow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [winningPrizeDetails, setWinningPrizeDetails] = useState(null);

  const fetchData = async () => {
  const data2 = await  getLuckySpinData(userId);

  if(data2.success
){setWinnings( data2.luckySpin?.History)}


  console.log(data2)
      const data = await fetchLuckySpinPrizes();

      setPrizes(data);
      try {
      } catch (err) {
        console.error("Error checking LuckySpin:", err);
        alert(err?.message || "Something went wrong while checking spin");
      }
    }; 
    
    useEffect(() => {
   
    fetchData();
  }, []);
  const checkSpinLimit = async () => {
    const data2 = await checkLuckySpinValidation(userId);
    console.log(data2);

    if (data2.canSpin) {
      setIsLuckyAllow(data2);
      return true;
    } else {
      alert(`Daily Spin Limit ${data2.SpinLimit} has been reached!`);
      return false;
    }
  };
  const startSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    try {
      const res = await spinItem();
      const selectedItem = await res.json();
      const newResult = prizes.findIndex(
        (p) => p.name === selectedItem.itemName
      );

      if (newResult === -1) {
        console.error("Prize not found");
        setIsSpinning(false);
        return;
      }

      setResult(newResult);

      setTimeout(() => {}, 4000);

      try {
        const status = await checkSpinLimit();
        if (status) {
          const res2 = await createLuckySpin(userId, prizes[newResult].value,prizes[newResult]);
          console.log(res2);
          if(res2?.success){
          setWinnings(
res2?.luckySpin?.History);}
        } else {
          setIsSpinning(false);
          return;
        }
      } catch (e) {
        alert(e?.message || "Something went wrong");
        console.error("LuckySpin error:", e);
        return;
      }

      setIsLuckyAllow(false);
      setIsSpinning(false);
      setWinningPrizeDetails(prizes[newResult]);
      setShowModal(true);
      
    } catch (err) {
      console.error(err);
      setIsSpinning(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="header2">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="black" />
        </button>
        <h1 className="header-title">Lucky Draw</h1>
        <div className="spacer"></div>
      </div>

      {/* Main Container */}
      <div
        style={{
          width: "90%",
          height: "90vh",
          backgroundColor: "white",
          borderRadius: "1.25rem",
          marginTop: "1.5rem",

          overflow: "hidden",
          padding: "1.5rem",

          paddingTop: ".5rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Slot Machine */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "12rem",
              height: "12rem",
              border: "3px solid #f5800bff",
              borderRadius: "1rem",
              overflow: "hidden",
              backgroundColor: "#fff8e1",
            }}
          >
            <Reel prizes={prizes} isSpinning={isSpinning} finalValue={result} />
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <button
            onClick={startSpin}
            disabled={!IsLuckyAllow && isSpinning}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              backgroundColor: isSpinning ? "#febb8cff" : "#fb9246ff",
              color: "white",
              borderRadius: "20px",
              padding: "0.75rem 1rem",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: isSpinning ? "not-allowed" : "pointer",
              border: "2px solid gray",

              transition: "all 0.3s ease-in-out",
            }}
          >
            {isSpinning ? "Spinning..." : "🎯 Start Spin"}
          </button>
        </div>

        {/* Rewards */}
        <h3
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          🎁 Rewards
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",

            overflow: "scroll",
          }}
        >
          {prizes.map((p, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                border: "1px solid #f3f4f6",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                width: "5rem",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
              />
              <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                {p.value}
              </p>
            </div>
          ))}
        </div>

        {/* Winning Record */}
        <h3
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          🏆 My Winning Record
        </h3>
        <div
          style={{
            marginTop: "1rem",
            maxHeight: "35vh",
            minHeight: "35vh",

            overflow: "scroll",
          }}
        >
          {winnings.map((win) => (
            <div
              key={win.today}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff8e1",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <img
                src={win.data.image}
                alt="win"
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  marginRight: "0.75rem",
                }}
              />
              <div>
                <p style={{ fontWeight: "bold" }}>{win.data.name}</p>
               <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
  {(() => {
    const d = new Date(win.today);
    return `${d.getDate().toString().padStart(2, "0")}/${
      (d.getMonth() + 1).toString().padStart(2, "0")
    }/${d.getFullYear()} ${d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  })()}
</p>

                <p style={{ color: "#d97706", fontWeight: "600" }}>
                  {win.data.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && winningPrizeDetails && (
        <PrizeModal
          prize={winningPrizeDetails}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LuckyDraw;
