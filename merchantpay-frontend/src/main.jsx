import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { RealtimeProvider } from "./context/RealtimeContext";
import { CartProvider } from "./context/CartContext";
import axios from "axios";

// Automatically attach JWT token to all Axios requests if available
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RealtimeProvider>
        <CartProvider>
        <App />
        </CartProvider>
      </RealtimeProvider>
    </AuthProvider>
  </React.StrictMode>
);