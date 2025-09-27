import React from "react";
import photo from "../assets/imgi_394_original-79b3d9caf33e062ec6d14d4cbbb02155.jpeg";

import {
  UserIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";

const features = [
  { title: "Registration", icon: UserIcon },
  { title: "Search Option", icon: MagnifyingGlassIcon },
  { title: "Geolocation", icon: MapPinIcon },
  { title: "Charging Slot Booking", icon: CalendarDaysIcon },
  { title: "Multiple Car Compatibility", icon: CreditCardIcon },
  { title: "Push Notification", icon: BellAlertIcon },
];

function Car() {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 gap-12 py-16 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl"></div>

      {/* Left Side - Image */}
      <div className="flex justify-center lg:w-1/2 z-10">
        <img
          src={photo}
          alt="Electric Car Charging"
          className="max-w-full lg:max-w-sm drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
        />
      </div>

      {/* Right Side - Features */}
      <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 z-10">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group flex flex-col items-center bg-gray-100 border border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-gray-400"
            >
              <div className="text-black">
                <Icon className="w-8 h-8" />
              </div>
              <p className="mt-3 font-semibold text-black text-center text-sm sm:text-base group-hover:text-gray-800">
                {feature.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Car;
