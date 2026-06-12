const BASE_URL = "http://localhost:8080/api/auth";

// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const result = await res.json();

    // Save JWT token
    localStorage.setItem("token", result.token);

    return result;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};