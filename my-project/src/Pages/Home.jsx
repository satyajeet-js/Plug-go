import React from "react";
import { motion } from "framer-motion";
import {
  Battery100Icon,
  MapIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import bgImage from "../assets/imgi_221_car-realistic-3d-charger-concepts-automotive-industry-ecological-alternative_348818-3231.jpg";
import information from "../assets/WhatsApp Image 2025-08-31 at 17.35.39_5adc2584.jpg";
import Car from "./Car";
import types from "../assets/ccs-connector.webp";
import types2 from "../assets/type-2-connector.webp";
import chademo from "../assets/CHAdeMO-dla-pojazd-elektryczny-samoch-d-stacja-aduj-ca-adowarka-EV-z-cze-200A-5m-CHADEMO_jpg_600x600.webp";
import FaqAccordion from "./FaqAccordion";

// Variants for animations
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />

        {/* Animated Content */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 px-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Power Your Journey with{" "}
            <span className="text-blue-400">PlugnGo</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover the fastest EV charging stations near you with real-time
            availability, smart navigation, and seamless payments.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp}>
              <Link
                to={"/Location"}
                className="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:shadow-[0_0_25px_rgba(59,130,246,1)] transition"
              >
                ⚡ Find Stations
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link
                to="/doc"
                className="px-8 py-3 rounded-full border border-gray-400 text-white font-semibold hover:bg-white hover:text-black transition"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="relative bg-gray-100 py-20 px-6 flex justify-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="backdrop-blur-lg bg-white/70 border border-gray-200 rounded-3xl shadow-xl max-w-6xl w-full p-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Why Choose <span className="text-black">PlugnGo?</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-gray-600 max-w-2xl mx-auto"
            >
              Built for the future of mobility — fast, reliable, and sustainable.
            </motion.p>
          </div>

          {/* Feature Cards */}
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                icon: Battery100Icon,
                title: "Ultra-Fast Charging",
                text: "Recharge up to 80% in 20 minutes with next-gen charging.",
              },
              {
                icon: MapIcon,
                title: "Wide Coverage",
                text: "Access 500+ charging points across cities and highways.",
              },
              {
                icon: ClockIcon,
                title: "24/7 Availability",
                text: "Real-time station tracking ensures you’re never stuck.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Secure Charging",
                text: "Advanced monitoring & safety-first technology.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-8 text-center text-gray-900 hover:bg-white hover:shadow-lg transition transform hover:-translate-y-2"
              >
                <feature.icon className="w-14 h-14 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Car Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Car />
      </motion.section>

      {/* Info Image */}
      <motion.section
        variants={scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <img
          src={information}
          alt="information"
          className="mx-auto h-150 object-cover rounded-lg shadow-lg"
        />
      </motion.section>

      {/* DC Charging Types */}
      <motion.section
        className="mt-25"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl font-bold text-center mb-20 text-black drop-shadow-lg"
        >
          Direct Current (DC)
        </motion.h2>

        <div className="flex flex-col items-center gap-8">
          {[{ src: types, name: "CCS Connector" },
            { src: types2, name: "CHAdeMO Connector" },
            { src: chademo, name: "GB/T Connector" }
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="text-center p-6 w-72 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:bg-white/20"
            >
              <img
                src={c.src}
                alt={c.name}
                className="w-24 h-24 mx-auto transition-transform duration-500 hover:scale-110"
              />
              <p className="mt-4 font-semibold text-black">{c.name}</p>
            </motion.div>
          ))}

          <Link
            to={"/doc"}
            className="mt-6 px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:bg-pos-100 transition-all duration-500 shadow-lg hover:shadow-pink-500/50"
          >
            Know more
          </Link>
        </div>
      </motion.section>

      {/* Login CTA */}
      <motion.section
        className="mt-30"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Get Started with PlugnGo
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Join our community and start enjoying the benefits of fast and reliable EV charging.
        </p>
        <div className="flex justify-center">
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            Login
          </Link>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <FaqAccordion />
      </motion.section>
    </div>
  );
};

export default Home;
