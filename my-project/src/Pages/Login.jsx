// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/2bf33566-d328-4082-b550-1c0fb107ed9c.webp";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // send both username and name just in case backend expects 'name'
      const payload = {
        username: form.username,
        name: form.username,
        email: form.email,
        password: form.password,
      };

      const res = await axios.post("https://plug-go-backend.onrender.com/api/signup", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup response:", res);

      const data = res.data || {};

      // Accept success if backend returns success=true OR normal 200/201
      if (data.success || res.status === 201 || res.status === 200) {
        alert(data.message || "Signup successful");

        // normalize user object to read later in Navbar
        const userObj = {
          email: data.user?.email || form.email,
          name:
            data.user?.username ||
            data.user?.name ||
            form.username ||
            data.user?.email,
          avatar: null, // we'll render the SVG avatar in Navbar
          token: data.token || null,
        };

        localStorage.setItem("user", JSON.stringify(userObj));

        // notify other components (Navbar) in same window to update immediately
        window.dispatchEvent(new Event("userChanged"));

        navigate("/location");
      } else {
        // backend returned something but not success
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err.response || err.message);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Signup failed";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Plug&Go Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-gray-800">Plug&Go</span>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Create Your Account
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />

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
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
