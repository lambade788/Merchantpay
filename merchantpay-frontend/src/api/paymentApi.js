const BASE_URL = "http://localhost:8080/api";

// 🔐 Get token
const getToken = () => localStorage.getItem("token");

// 🛠️ Demo Mode Helpers
export const isDemoMode = () => localStorage.getItem("isDemoMode") === "true";

export const getMockData = () => {
  const data = localStorage.getItem("demoData");
  if (data) return JSON.parse(data);
  
  const initialData = {
    transactions: [
      { id: "1", linkId: "DEMO-123", amount: 1500, status: "SUCCESS", paidAt: new Date().toISOString(), method: "UPI" },
      { id: "2", linkId: "DEMO-456", amount: 2500, status: "SUCCESS", paidAt: new Date(Date.now() - 86400000).toISOString(), method: "CARD" },
      { id: "3", linkId: "DEMO-789", amount: 500, status: "FAILED", paidAt: new Date(Date.now() - 172800000).toISOString(), method: "UPI" },
    ],
    links: [
      { id: "DEMO-123", linkId: "DEMO-123", title: "Test Product", amount: 1500, status: "ACTIVE", createdAt: new Date().toISOString() },
      { id: "DEMO-456", linkId: "DEMO-456", title: "Service Fee", amount: 2500, status: "PAID", createdAt: new Date(Date.now() - 86400000).toISOString() },
    ]
  };
  localStorage.setItem("demoData", JSON.stringify(initialData));
  return initialData;
};

export const saveMockData = (data) => {
  localStorage.setItem("demoData", JSON.stringify(data));
};

export const getDemoProducts = () => {
  const data = localStorage.getItem("demoProducts");
  if (data) return JSON.parse(data);
  const initial = [
    { id: 1, name: "Premium Widget", stock: 15, price: 500, imageUrl: "https://placehold.co/40" },
    { id: 2, name: "Super Gadget", stock: 2, price: 1200, imageUrl: "https://placehold.co/40" }
  ];
  localStorage.setItem("demoProducts", JSON.stringify(initial));
  return initial;
};

export const saveDemoProducts = (data) => {
  localStorage.setItem("demoProducts", JSON.stringify(data));
};

export const getDemoOrders = () => {
  const data = localStorage.getItem("demoOrders");
  if (data) return JSON.parse(data);
  return [];
};

export const saveDemoOrders = (data) => {
  localStorage.setItem("demoOrders", JSON.stringify(data));
};

// ==============================
// CREATE PAYMENT LINK
// ==============================
export const createPaymentLink = async (data) => {
  if (isDemoMode()) {
    const mockData = getMockData();
    const newLink = {
      id: "DEMO-" + Math.floor(Math.random() * 10000),
      linkId: "DEMO-" + Math.floor(Math.random() * 10000), // Added linkId
      title: data.title || "New Demo Link",
      amount: data.amount,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };
    mockData.links.unshift(newLink);
    saveMockData(mockData);
    return newLink;
  }

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
  if (isDemoMode()) {
    return getMockData().transactions;
  }

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
  if (isDemoMode()) {
    return getMockData().links;
  }

  const res = await fetch(`${BASE_URL}/payment-links`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch links");
  return res.json();
};

// ==============================
// GET SINGLE LINK
// ==============================
export const getPaymentLink = async (linkId) => {
  if (isDemoMode() || linkId.startsWith("DEMO-")) {
    const link = getMockData().links.find(l => l.id === linkId || l.linkId === linkId);
    if (!link) throw new Error("Mock link not found");
    return link;
  }

  const res = await fetch(`${BASE_URL}/payment-links/${linkId}`);

  if (!res.ok) throw new Error("Failed to fetch payment link");
  return res.json();
};

// ==============================
// ✅ PAY NOW (FINAL FIX)
// ==============================
export const payNow = async (linkId, method) => {
  if (isDemoMode() || linkId.startsWith("DEMO-")) {
    const mockData = getMockData();
    const linkIndex = mockData.links.findIndex(l => l.id === linkId || l.linkId === linkId);
    if (linkIndex === -1) throw new Error("Mock link not found");
    
    mockData.links[linkIndex].status = "PAID";
    
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      linkId: linkId,
      amount: mockData.links[linkIndex].amount,
      status: "SUCCESS",
      paidAt: new Date().toISOString(),
      method: method
    };
    mockData.transactions.unshift(newTransaction);
    saveMockData(mockData);

    // Trigger Soundbox notification across tabs for Demo Mode
    localStorage.setItem("demo_payment_trigger", JSON.stringify({
      amount: newTransaction.amount,
      method: method,
      timestamp: Date.now()
    }));
    
    // Dispatch local event for same-tab triggers
    window.dispatchEvent(new CustomEvent("local_payment_trigger", {
      detail: { amount: newTransaction.amount, method }
    }));
    
    const orders = getDemoOrders();
    const orderIndex = orders.findIndex(o => o.paymentLinkId === linkId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = "SUCCESS";
      saveDemoOrders(orders);
    }
    
    return newTransaction;
  }

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