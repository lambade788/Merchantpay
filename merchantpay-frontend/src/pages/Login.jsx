import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.text();

      if (data === "User not found" || data === "Invalid password") {
        alert(data);
        return;
      }

      // ✅ STORE TOKEN
      localStorage.setItem("token", data);

      // ✅ STORE USER (TEMP NAME FROM EMAIL)
      const userData = {
        name: email.split("@")[0], // temporary solution
        email: email
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8">

        <h1 className="text-3xl text-center mb-4">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-dark border"
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-dark border"
          />

          <button className="w-full bg-primary py-3 rounded">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}