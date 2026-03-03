import React, { useState } from "react";
import axios from "axios";
import phone from "../assets/6757e1a583ec6b050fd7547e_Smart Discovery_compressed.webp";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://plug-go-backend.onrender.com/api/contact", form);
      alert(res.data.message);
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Error sending message");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center bg-[#e9f0fc] px-6 py-12 md:px-16 gap-10">
      {/* Left Side */}
      <div className="flex-1 space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">Contact Us</h2>
        <img src={phone} alt="Phone" className="w-full h-auto" />
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-white rounded-3xl shadow-md p-8 max-w-lg w-full">
        <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
        <p className="text-gray-600 mb-6">You can reach us anytime</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className="flex-1 p-3 rounded-full border border-gray-300 text-sm"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className="flex-1 p-3 rounded-full border border-gray-300 text-sm"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-full border border-gray-300 text-sm"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-full border border-gray-300 text-sm"
          />

          <textarea
            name="message"
            placeholder="How can we help?"
            value={form.message}
            onChange={handleChange}
            maxLength="120"
            className="w-full p-3 rounded-2xl border border-gray-300 text-sm h-28 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
