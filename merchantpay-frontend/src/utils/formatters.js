// FORMAT CURRENCY (₹)
export const formatCurrency = (amount) => {
  if (!amount) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

// FORMAT DATE
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// FORMAT TIME
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// STATUS COLOR (for UI)
export const getStatusColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return "text-green-400";
    case "PENDING":
      return "text-yellow-400";
    case "FAILED":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};