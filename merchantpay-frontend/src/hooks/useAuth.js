import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  const auth = useAuthContext();
  const navigate = useNavigate();

  // LOGIN WITH REDIRECT
  const loginAndRedirect = async (data) => {
    try {
      await auth.login(data);
      navigate("/"); // redirect after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // LOGOUT WITH REDIRECT
  const logoutAndRedirect = () => {
    auth.logout();
    navigate("/login");
  };

  return {
    ...auth,
    loginAndRedirect,
    logoutAndRedirect,
  };
}