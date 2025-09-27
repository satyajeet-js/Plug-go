import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";

// Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Location from "./Pages/Location";
import Contact from "./Pages/Contact";
import ErrorPage from "./Pages/ErrorPage";
import Doc from "./Pages/Doc";
import Login from "./Pages/Signup";
import Signup from "./Pages/Login"; // ✅ FIX: Import Signup

function App() {
  return (
    <Routes>
      {/* Pages with Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doc" element={<Doc />} />
        <Route path="/about" element={<About />} />
        <Route path="/location" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ Added correctly */}
      </Route>

      {/* Special Pages without Navbar/Footer */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
