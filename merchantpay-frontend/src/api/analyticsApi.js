const BASE_URL = "http://localhost:8080/api/analytics";

// Helper
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// GET DASHBOARD STATS
export const getDashboardStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return await res.json();
  } catch (error) {
    console.error("Analytics Error:", error);
    throw error;
  }
};

// GET TRANSACTION ANALYTICS
export const getTransactionAnalytics = async () => {
  try {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch analytics");
    }

    return await res.json();
  } catch (error) {
    console.error("Analytics Error:", error);
    throw error;
  }
};