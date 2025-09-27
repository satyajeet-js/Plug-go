import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import assets from "../assets/2bf33566-d328-4082-b550-1c0fb107ed9c.webp";

import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/" className="flex items-center">
                <img 
                  src={assets} 
                  alt="PlugnGo Logo" 
                  className="w-10 h-10 inline-block align-middle"
                />
                <span className="font-bold text-lg text-gray-900 inline-block align-middle -ml-1">
                  Plug&Go
                </span>
              </Link>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              PlugnGo empowers teams to transform raw data into clear,
              compelling visuals — making insights easier to share,
              understand, and act on.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 text-gray-600">
              <a href="#">
                <FaTwitter className="text-xl hover:text-black" />
              </a>
              <a href="#">
                <FaInstagram className="text-xl hover:text-black" />
              </a>
              <a href="#">
                <FaLinkedin className="text-xl hover:text-black" />
              </a>
              <a href="#">
                <FaGithub className="text-xl hover:text-black" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-black">Features</a></li>
              <li><a href="#" className="hover:text-black">Pricing</a></li>
              <li><a href="#" className="hover:text-black">Integrations</a></li>
              <li><a href="#" className="hover:text-black">Changelog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-black">Documentation</a></li>
              <li><a href="#" className="hover:text-black">Tutorials</a></li>
              <li><a href="#" className="hover:text-black">Blog</a></li>
              <li><a href="#" className="hover:text-black">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-black">About</a></li>
              <li><a href="#" className="hover:text-black">Careers</a></li>
              <li><a href="#" className="hover:text-black">Contact</a></li>
              <li><a href="#" className="hover:text-black">Partners</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <p>© 2025 Graphy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
