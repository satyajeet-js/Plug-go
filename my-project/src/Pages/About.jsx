import React from "react";
import { FaLeaf, FaUsers, FaAward, FaHeart } from "react-icons/fa";
import Harsh from "../assets/WhatsApp Image 2025-09-27 at 19.37.08_e9bc23a6.jpg"
import Satyajeet from "../assets/WhatsApp Image 2025-09-27 at 20.21.16_0954f654.jpg"
function About() {
  return (
    <div className="relative">
      {/* Background color instead of gradient */}
      <div className="absolute inset-0 bg-[#D6E7F3] -z-10"></div>

      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* ===== Mission & Vision Section ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            {/* Mission */}
            <div className="backdrop-blur-lg bg-white/50 border border-white/30 shadow-xl rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We exist to accelerate the world's transition to sustainable
                transportation by making electric vehicles more accessible,
                convenient, and affordable for everyone.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through our comprehensive network of charging stations and rental
                services, we're breaking down the barriers to electric vehicle
                adoption and creating a cleaner, more sustainable future for
                generations to come.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-r from-green-400/90 to-blue-600/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-white border border-white/30">
              <div className="flex items-center gap-3 mb-4">
                <FaHeart className="w-7 h-7 text-white drop-shadow" />
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                A world where electric vehicles are the primary mode of
                transportation, where clean energy powers our mobility, and where
                everyone has access to sustainable transportation solutions.
              </p>
            </div>
          </div>

          {/* ===== Core Values Section ===== */}
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/30 shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300">
                <FaLeaf className="w-10 h-10 text-green-600 mx-auto mb-4 drop-shadow" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Sustainability First
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We're committed to reducing carbon emissions and promoting clean
                  energy solutions for a better planet.
                </p>
              </div>

              {/* Value 2 */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/30 shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300">
                <FaUsers className="w-10 h-10 text-blue-600 mx-auto mb-4 drop-shadow" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Customer Focused
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our customers are at the heart of everything we do. We strive to
                  exceed expectations every day.
                </p>
              </div>

              {/* Value 3 */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/30 shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300">
                <FaAward className="w-10 h-10 text-orange-600 mx-auto mb-4 drop-shadow" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Innovation Drive
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We continuously innovate to provide the most advanced and
                  user-friendly electric vehicle solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Meet Our Team Section ===== */}
      <section className="bg-white/60 backdrop-blur-lg py-16 px-6 text-center border-t border-gray-200/40">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Meet Our Team
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12">
          Our diverse team of experts is passionate about sustainable transportation 
          and committed to excellence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Member 1 */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 p-6 flex flex-col items-center">
            <img src={Harsh} alt="Sarah Martinez" className="w-40 h-40 object-cover rounded-xl mb-6 shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Harsh</h3>
            <p className="text-blue-600 font-medium mb-2">CEO &amp; Founder</p>
            <p className="text-gray-600 text-sm">
              Former Tesla executive with 15+ years in sustainable transportation
            </p>
          </div>

          {/* Member 2 */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 p-6 flex flex-col items-center">
            <img src={Satyajeet} alt="David Chen" className="w-40 h-40 object-cover rounded-xl mb-6 shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Satyajeet</h3>
            <p className="text-blue-600 font-medium mb-2">CTO</p>
            <p className="text-gray-600 text-sm">
              Technology leader specializing in smart charging infrastructure
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
