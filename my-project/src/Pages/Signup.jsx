import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/2bf33566-d328-4082-b550-1c0fb107ed9c.webp";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message);

        // ✅ Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: res.data.user?.email,
            name: res.data.user?.name,
            avatar: res.data.user?.avatar || "https://i.pravatar.cc/150",
            token: res.data.token,
          })
        );

        navigate("/location");
      } else {
        alert("Invalid login details");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Plug&Go Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-gray-800">Plug&Go</span>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Login to Your Account
        </h2>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg text-sm font-medium"
          >
            Login
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
