import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

import "./Orders.css";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { getUserInfo, SECRET_KEY, sendClaim } from "../api";
import pako from "pako";
export default function Orders() {
  const isApiLocked = useRef(false);
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [UserData, setUserData] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null);
  const [timer, setTimer] = useState(0); // For countdown updates
  const navigate = useNavigate();

  const fetchUser = async () => {
    const encryptedUser = Cookies.get("2ndtredingWebUser");
    if (!encryptedUser) return navigate("/login");

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
    const Data = await JSON.parse(decompressed);
    setUserData(Data);

    if (!Data?._id) return navigate("/login");

    try {
      const res = await getUserInfo(Data._id);
      const userPurchases = (res?.data?.users?.purchases || [])
        .slice()
        .reverse();
      setOrders(userPurchases);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refresh every second for countdown
  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.cycleType?.toLowerCase() === filter);

  const renderTimeLeft = (order, i) => {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    const startTime =
      new Date(order.createdAt).getTime() +
      i * (order.cycleType === "day" ? msPerDay : 0);
    let leftTime = 0;

    if (order.cycleType === "hour") {
      leftTime =
        new Date(order.createdAt).getTime() + (i + 1) * 60 * 60 * 1000 - now;
      if (leftTime <= 0) return "Time Slot Completed";
    } else {
      const endTime = startTime + msPerDay;
      if (now >= endTime) return "Time Slot Completed";
      if (now >= startTime && now < endTime) leftTime = endTime - now;
      else if (now < startTime)
        return `${Math.ceil((startTime - now) / msPerDay)} day(s) left`;
    }

    const totalSeconds = Math.floor(leftTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleClaim = async (
    purchaseId,
    cycleIndex,
    claimAmount,
    isCycleComplete
  ) => {
     if (isApiLocked.current) return;

    isApiLocked.current = true;
    if (!UserData?._id) return;
    try {
      const res = await sendClaim(
        UserData._id,
        purchaseId,
        cycleIndex,
        claimAmount,
        isCycleComplete
      );

      if (res.data.success) {
        setClaimStatus({
          type: "success",
          message: `Claimed ₹${cycleIndex===-1?res.data.claimAmount: claimAmount} successfully!`,
        });

        // Update orders
        setOrders((prevOrders) =>
          prevOrders.map((p) => {
            if (p.purchaseId === purchaseId) {
              const newClaimed = [...(p.claimedCycles || []), cycleIndex];
              return { ...p, claimedCycles: newClaimed };
            }
            return p;
          })
        );

        // Update modalOrder if it's open
        setModalOrder((prev) => {
          if (prev && prev.purchaseId === purchaseId) {
            const newClaimed = [...(prev.claimedCycles || []), cycleIndex];
            return { ...prev, claimedCycles: newClaimed };
          }
          return prev;
        });
        fetchUser();
      } else {
        setClaimStatus({
          type: "fail",
          message: res.data.message || "Claim failed!",
        });
      }

      setTimeout(() => setClaimStatus(null), 2000);
    } catch (err) {
      console.error(err);
      setClaimStatus({ type: "fail", message: "Claim failed!" });
      setTimeout(() => setClaimStatus(null), 2000);
    } finally {
      setTimeout(() => {
        isApiLocked.current = false;
      }, 2000);
    }
  };
// const handleClaimRecord = async (
//     purchaseId,
//     cycleIndex,
//     claimAmount,
//     isCycleComplete
//   ) => {
//     if (!UserData?._id) return;

//     try {
//       const res = await handleClaimRecordDB(
//         UserData._id,
//         purchaseId,
//         cycleIndex,
//         claimAmount,
//         isCycleComplete
//       );

//       if (res.data.success) {
//         setClaimStatus({
//           type: "success",
//           message: `Claimed ₹${cycleIndex===-1?res.data.claimAmount: claimAmount} successfully!`,
//         });

//         // Update orders
//         setOrders((prevOrders) =>
//           prevOrders.map((p) => {
//             if (p.purchaseId === purchaseId) {
//               const newClaimed = [...(p.claimedCycles || []), cycleIndex];
//               return { ...p, claimedCycles: newClaimed };
//             }
//             return p;
//           })
//         );

//         // Update modalOrder if it's open
//         setModalOrder((prev) => {
//           if (prev && prev.purchaseId === purchaseId) {
//             const newClaimed = [...(prev.claimedCycles || []), cycleIndex];
//             return { ...prev, claimedCycles: newClaimed };
//           }
//           return prev;
//         });
//         fetchUser();
//       } else {
//         setClaimStatus({
//           type: "fail",
//           message: res.data.message || "Claim failed!",
//         });
//       }

//       setTimeout(() => setClaimStatus(null), 2000);
//     } catch (err) {
//       console.error(err);
//       setClaimStatus({ type: "fail", message: "Claim failed!" });
//       setTimeout(() => setClaimStatus(null), 2000);
//     }
//   };
  return (
    <div className="orders-page">
      <div className="header2">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft color="black" />
        </button>
        <h1 className="header-title">My Order</h1>
        <div className="spacer"></div>
      </div>

      <div className="tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "day" ? "active" : ""}
          onClick={() => setFilter("day")}
        >
          Day
        </button>
        <button
          className={filter === "hour" ? "active" : ""}
          onClick={() => setFilter("hour")}
        >
          Hour
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          filteredOrders.map((order, index) => {
            const totalCycles = Number(order.cycleValue);
            const elapsed =
              order.cycleType === "hour"
                ? Math.floor(
                    (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60)
                  )
                : Math.floor(
                    (Date.now() - new Date(order.createdAt)) /
                      (1000 * 60 * 60 * 24)
                  );
            const claimableCount = Math.min(elapsed, totalCycles);
            const claimaCount = order.claimedCycles.length;

            return (
              <motion.div
                key={index}
                className="order-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                {" "}
                <b>{order.productName}</b>
                <div className="order-title">
                  <div></div>
                  <button
                    className="claim-btn"
                    style={{
                      backgroundColor:
                        claimableCount === totalCycles ? "#b8b8b8" : "#56d18a",
                      color: "white",
                    }}
                  >
                    {claimableCount === totalCycles ? "Expired" : "Active"}
                  </button>
                  
                    <button
                      style={{
                        display:
                          claimaCount === totalCycles ? "none" : "block",
                      }}
                      className="claim-btn"
                      onClick={() => setModalOrder(order)}
                      disabled={claimaCount === totalCycles}
                    >
                      Records Info ({claimableCount}/{totalCycles}) 
                 
                    </button>
             
                    <button
                      className="claim-btn"
                      style={{
                        backgroundColor:
                         ( order.claim === "waiting" &&
                          claimableCount === totalCycles )|| order.exp
                            ? "black"
                            : "gray",
                        color: "white",
                        cursor:
                          order.claim === "waiting" &&
                          claimableCount === totalCycles
                            ? "pointer"
                            : "not-allowed",
                      }}
                      disabled={ 
                          ( order.claim === "claimed" &&
                          claimableCount === totalCycles
                           )||order.exp
                        
                      }
                      onClick={() => handleClaim(order.purchaseId, -1, 0, true)}
                    >
                      {order.claim === "claimed" ? (
                        <>Claimed ✅</>
                      ) : order.claim === "waiting" &&
                        claimableCount === totalCycles ? (
                        <>
                          Claim ₹
                          {(
                            order.cycleValue *
                            order.dailyIncome *
                            order.quantity
                          ).toFixed(2)}{" "}
                          ({claimableCount}/{totalCycles})
                        </>
                      ) : (
                        <>
                          Claim Locked ₹
                          {(
                            order.cycleValue *
                            order.dailyIncome *
                            order.quantity
                          ).toFixed(2)}
                          ({claimableCount}/{totalCycles})
                        </>
                      )}
                    </button>
                   
                </div>
                <div className="order-body">
                  <div className="order-row">
                   
                  </div>
                  <div className="order-row">
                    <span className="order-label">Buy Share</span>
                    <span className="order-value">{order.quantity}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">Cycle</span>
                    <span className="order-value">
                      {order.cycleValue} {order.cycleType}
                    </span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">
                      {order.cycleType === "hour"
                        ? "Hourly Income"
                        : "Daily Income"}
                    </span>
                    <span className="order-value">₹{order.dailyIncome}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">Item Price</span>
                    <span className="order-value">
                      ₹{(order.TotalAmount / order.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">Total Amount</span>
                    <span className="order-value">₹{order.TotalAmount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      {/* Claim Status Popup */}
      {claimStatus && (
        <motion.div
          className={`claim-status ${claimStatus.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {claimStatus.message}
        </motion.div>
      )}

      {modalOrder && (
        <div className="modal-overlay" onClick={() => setModalOrder(null)}>
          <motion.div
            className="claim-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modalOrder.productName} - Claim List</h3>

            <ul className="claim-list">
              {Array.from({ length: Number(modalOrder.cycleValue) }).map(
                (_, i) => {
                  const incomePerCycle =
                    modalOrder.dailyIncome * modalOrder.quantity;
                  const isAvailable = (modalOrder.claimedCycles || []).includes(
                    i
                  )
                    ? false
                    : renderTimeLeft(modalOrder, i) === "Ready to Claim";

                  return (
                    <li
                      key={i}
                      className={`claim-item ${
                        isAvailable ? "available" : "locked"
                      }`}
                    >
                      <span>
                        {modalOrder.cycleType === "hour"
                          ? `Hour ${i + 1}`
                          : `Day ${i + 1}`}
                      </span>
                      <span>
                        ₹{incomePerCycle.toFixed(2)} -{" "}
                        {renderTimeLeft(modalOrder, i) === "Time Slot Completed" &&
                        !isAvailable
                          ? "Time Slot Completed ✅"
                          : renderTimeLeft(modalOrder, i)}
                      </span>
                      {/* {isAvailable && (
                        <button
                          className="claim-now-btn"
                          onClick={() =>
                            handleClaimRecord(
                              modalOrder.purchaseId,
                              i,
                              incomePerCycle,
                              false
                            )
                          }
                        >
                          Claim
                        </button>
                      )} */}
                    </li>
                  );
                }
              )}
            </ul>
            <button className="close-modal" onClick={() => setModalOrder(null)}>
              <X size={18} color="white" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
