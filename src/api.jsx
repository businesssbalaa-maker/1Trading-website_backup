import axios from "axios";
import { decryptResponse } from "./utils/decrypt";

// ✅ Exported base URL (so other files like Account.jsx can import it)
export const API_BASE_URL = "https://bdgwin.com.co/";
export const API_BASE_URL2 = "https://bdgwin.com.co";
// export const API_BASE_URL = "http://localhost:5004/";
// export const API_BASE_URL2 = "http://localhost:5004";

// ✅ Shared secret key (must match backend)
export const SECRET_KEY = "SECRET_KEY12356789";

export const getRandomUPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}api/upi/random`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (err) {
    console.error("Error fetching random UPI", err);
    return { success: false, message: "Network error" };
  }
};



// Register a new user
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/users/register`, userData);
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err);
    throw err;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/users/login`, credentials);
    return res.data;
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};

export const fetchLuckySpinPrizes = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}api/luckySpin/items`);
    const data = await res.json();
    const mappedPrizes = data.map((item) => ({
      name: item.itemName,
      value: item.reward,
      image: `${API_BASE_URL2}${item.imageUrl}`,
    }));
    return mappedPrizes;
  } catch (err) {
    console.error("Failed to fetch prizes:", err);
    return {};
  }
};

export const spinItem = async () => {
  const data = await fetch(`${API_BASE_URL}api/luckySpin/spinItem`);
  return data;
};
export const checkLuckySpinValidation = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}api/users/user-luckySpin-validationcheck`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  } catch (err) {
    console.error("Validation API error:", err);
    return { success: false, message: err.message };
  }
};
export const createLuckySpin = async (userId,amount,data) => {
  try {
    const res = await fetch(`${API_BASE_URL}api/users/user-luckySpin-dataCreate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId,amount,data }),
    });
    return await res.json();
  } catch (err) {
    console.error("Create Spin API error:", err);
    return { success: false, message: err.message };
  }
};
export const getLuckySpinData = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}api/users/user-luckySpin-dataGet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  } catch (err) {
    console.error("Get Spin Data API error:", err);
    return { success: false, message: err.message };
  }
};
export const productGet = async () => {
  const data = await fetch(`${API_BASE_URL}api/products`);
  return data;
};

export const QRrandom = async () => {
  const data = await fetch(`${API_BASE_URL}QR/api/qr/random`);
  return data;
};

export const BuyProduct = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}QR/api/payments`, payload);
  return res;
};

export const RechargeBalence = async (payload) => {

  const res = await axios.post(`${API_BASE_URL}QR/api/recharge`, payload);
  return res;
};

export const GetBankDetails = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}api/withdraw/bank`, { params: { userId } });
  return res;
};

export const addBankDetails = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/withdraw/bank-details`, payload);
    return res.data;
  } catch (err) {
    console.error("Add Bank Details Error:", err);
    throw err.response?.data || err;
  }
};

export const updateBankDetails = async (payload) => {
  try {
    const res = await axios.put(`${API_BASE_URL}api/withdraw/bank-details/${payload.userId}`, payload);
    return res;
  } catch (err) {
    console.error("Update Bank Details Error:", err);
    throw err.response?.data || err;
  }
};

export const withdrawReq = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/withdraw`, payload);
    return res;
  } catch (err) {
    console.error("Withdraw Request Error:", err);
    throw err.response?.data || err;
  }
};

export const getUserInfo = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}api/users/user`, { params: { userId } });
  return res;
};
export const tokenVerify = async (token,phone) => {
  const res = await axios.get(`${API_BASE_URL}api/users/tokenVerify`, { params: { token,phone } });

  return res;
};
export const sendClaim = async (userId, purchaseId, cycleIndex, claimAmount,isCycleComplete) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/claimROI/add`, {
      userId,
      purchaseId,
      cycleIndex,
      claimAmount,
      isCycleComplete
    });
    return res;
  } catch (err) {
    console.error("Claim request failed:", err);
    throw err;
  }
};
export const handleClaimRecordDB = async (userId, purchaseId, cycleIndex, claimAmount,isCycleComplete) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/claimROI/add_Record`, {
      userId,
      purchaseId,
      cycleIndex,
      claimAmount,
      isCycleComplete
    });
    return res;
  } catch (err) {
    console.error("Claim request failed:", err);
    throw err;
  }
};
export const getTeamData = async (userId, teamLevel) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/users/get-team`, { _id: userId, teamLevel });
    return res.data;
  } catch (err) {
    console.error("Error fetching team:", err);
    return { success: false, message: "Request failed" };
  }
};

export const getTeamOverview = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}api/users/team-overview`, { params: { _id: userId } });
    return res.data;
  } catch (err) {
    console.error("Error fetching team overview:", err);
    return { success: false, message: "Request failed" };
  }
};

export const getTeamLevel = async (userId, level) => {
  try {
    const res = await axios.get(`${API_BASE_URL}api/users/team-level`, { params: { _id: userId, level } });
    return res.data;
  } catch (err) {
    console.error("Error fetching team level:", err);
    return { success: false, message: "Request failed" };
  }
};
export const fetchExplanationsApi = async () => {
  const res = await fetch(`${API_BASE_URL}QR/api/explanations`);
  const data = await res.json();

  return data;
};

export const sendOtp=async(phone)=>{ const res = await fetch(`${API_BASE_URL}api/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
  const json = await res.json();
  return decryptResponse(json.payload);
    }
    

    export const sendOtpNoCheck=async(phone)=>{ const res = await fetch(`${API_BASE_URL}api/users/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
       const json = await res.json();

  return decryptResponse(json.payload);
    }

    export const getSocialLinks = async () => {
  const res = await axios.get(`${API_BASE_URL}api/SocialMedia`);
  return res.data.data;
};