import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD DATA FROM LOCAL STORAGE
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // LOGIN FUNCTION
  const login = async (data) => {
    try {
      const res = await loginUser(data);

      setToken(res.token);
      localStorage.setItem("token", res.token);

      // Example user (update when backend gives real data)
      const userData = {
        name: data.email.split("@")[0],
        email: data.email
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return res;
    } catch (error) {
      throw error;
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    logoutUser();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);