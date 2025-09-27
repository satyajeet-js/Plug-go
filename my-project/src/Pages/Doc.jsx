import React from "react";
import battery from "../assets/imgi_206_focus-ev-station-recharging-battery-ev-car-blurred-family-synchronos_31965-321473.jpg";
import informatiom from "../assets/0030-Electric-Car-Chargers-Types-jpg.webp";
import types from "../assets/WhatsApp Image 2025-08-31 at 18.28.19_e58a9ea8.jpg";
import ev from "../assets/ChatGPT Image Aug 31, 2025, 09_58_16 PM.png";

const Doc = () => {
  return (
    <>
      {/* Background intro section */}
      <div
        className="relative min-h-screen h-[100svh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${battery}")` }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="backdrop-blur-md bg-white/30 p-10 rounded-2xl shadow-xl max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">INTRODUCTION</h2>
            <p className="text-white leading-relaxed">
              The <strong>PlugnGo Charging Station Project</strong> is designed
              to help users easily find the nearest charging locations for cars,
              bikes, and scooters. As the demand for electric mobility continues
              to grow, the need for accessible and reliable charging
              infrastructure becomes increasingly important. This project
              focuses on providing a sustainable, efficient, and user-friendly
              solution by enabling real-time access to nearby charging stations.
              Along with supporting different charging standards, it ensures
              faster, safer, and more convenient charging for all types of EV
              users. By integrating modern technologies such as IoT, renewable
              energy sources, and real-time monitoring, the project highlights
              the importance of green energy and innovation in reducing carbon
              emissions. Ultimately, this initiative not only simplifies EV
              adoption but also contributes toward building a cleaner, smarter,
              and more connected transportation ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Extra images with fixed size & responsiveness */}
      <section className="py-5 flex justify-center">
        <img
          src={types}
          alt="Types"
          className="max-w-4xl w-full rounded-lg shadow-lg object-contain"
        />
      </section>

      <section className="py-10 flex justify-center">
        <img
          src={ev}
          alt="Table"
          className="max-w-4xl w-full rounded-lg shadow-lg object-contain"
        />
      </section>

      <section className="py-10 flex justify-center">
        <img
          src={informatiom}
          alt="Charging info"
          className="max-w-4xl w-full rounded-lg shadow-lg object-contain"
        />
      </section>
    </>
  );
};

export default Doc;
