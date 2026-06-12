const BASE_URL = "http://localhost:8080/api";

// 🔐 Get token
const getToken = () => localStorage.getItem("token");

// ==============================
// CREATE PAYMENT LINK
// ==============================
export const createPaymentLink = async (data) => {
  const res = await fetch(`${BASE_URL}/payment-links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create payment link");
  return res.json();
};

// ==============================
// GET TRANSACTIONS
// ==============================
export const getTransactions = async () => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

// ==============================
// GET PAYMENT LINKS
// ==============================
export const getPaymentLinks = async () => {
  const res = await fetch(`${BASE_URL}/payment-links`);

  if (!res.ok) throw new Error("Failed to fetch links");
  return res.json();
};

// ==============================
// GET SINGLE LINK
// ==============================
export const getPaymentLink = async (linkId) => {
  const res = await fetch(`${BASE_URL}/payment-links/${linkId}`);

  if (!res.ok) throw new Error("Failed to fetch payment link");
  return res.json();
};

// ==============================
// ✅ PAY NOW (FINAL FIX)
// ==============================
export const payNow = async (linkId, method) => {
  const res = await fetch(
    `${BASE_URL}/pay/${linkId}?method=${method}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`, // ✅ ADD THIS
      },
    }
  );

  const data = await res.json().catch(() => null);
  return data;
};