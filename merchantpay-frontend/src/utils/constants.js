export const API_BASE_URL = "http://localhost:8080/api";

// AUTH
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};

// PAYMENT
export const PAYMENT_ENDPOINTS = {
  CREATE: "/payments/create",
  GET_ALL: "/payments",
};

// ANALYTICS
export const ANALYTICS_ENDPOINTS = {
  DASHBOARD: "/analytics/dashboard",
  TRANSACTIONS: "/analytics/transactions",
};

// STATUS TYPES
export const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

// ROLES (for future use)
export const USER_ROLES = {
  MERCHANT: "MERCHANT",
  ADMIN: "ADMIN",
};