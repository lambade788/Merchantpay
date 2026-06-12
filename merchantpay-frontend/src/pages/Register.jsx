import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // VALIDATION LOGIC
  const validate = () => {
    const newErrors = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.terms) {
      newErrors.terms = "You must accept the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessName: form.businessName,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.text();

    alert(data);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8">

        <h1 className="font-heading text-3xl text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-muted text-center mb-8">
          Start accepting payments with MerchantPay
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* BUSINESS NAME */}
          <div>
            <label className="block text-sm mb-1 text-muted">
              Business Name
            </label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
              className="w-full px-4 py-3 rounded-xl bg-dark border border-border text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
            />
            {errors.businessName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.businessName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1 text-muted">
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl bg-dark border border-border text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm mb-1 text-muted">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-dark border border-border text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm mb-1 text-muted">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-dark border border-border text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="accent-primary mt-1"
            />
            <span>I agree to the Terms & Conditions</span>
          </div>
          {errors.terms && (
            <p className="text-red-400 text-sm">
              {errors.terms}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-primary text-dark py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}