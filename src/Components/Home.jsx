// src/Components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoo from "../assets/logoo.png";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-24 pb-24 px-5 max-w-screen-xl h-[79vh] mx-auto bg-[#F7F3FF] rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: Logo */}
        <div className="flex justify-center">
          <img
            src={logoo}
            alt="TeleBot Logo"
            className="w-full max-h-screen object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right: Content */}
        <div className="text-center md:text-left">
          <h4 className="text-md font-semibold text-[#7B3AED] uppercase tracking-wide mb-2">
            Discover TeleBot
          </h4>
          <h2 className="text-4xl font-extrabold text-[#1A1A1A] mb-4">
            Create smarter conversations
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Use TeleBot to enhance your voice interactions with
            powerful automation tools. From outbound calling to smart replies,
            streamline every step of your communication journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-10 justify-center md:justify-start">
            <Link
              to="/outbound-call"
              className="bg-[#7B3AED] text-white font-semibold px-6 py-3 w-40 rounded-lg shadow-lg hover:bg-[#6C2AD9] transition-all duration-300"
            >
              Outbound Call
            </Link>
            {/* <Link
              to="/inbound-call"
              className="bg-[#7B3AED] text-white font-semibold px-6 py-3 w-40 rounded-lg shadow-lg hover:bg-[#6C2AD9] transition-all duration-300"
            >
              Inbound Call
            </Link> */}
            <Link
              to="/call-logs"
              className="bg-[#7B3AED] text-white text-center font-semibold px-6 py-3 w-40 rounded-lg shadow-lg hover:bg-[#6C2AD9] transition-all duration-300"
            >
              Call Logs
            </Link>
            {/* <Link
              to="/knowledge-base-upload"
              className="bg-[#7B3AED] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#6C2AD9] transition-all duration-300"
            >
              Create Assistant
            </Link> */}
                 {/* <Link
              to="/manage-assist"
              className="bg-[#7B3AED] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#6C2AD9] transition-all duration-300"
            >
              Manage Assistant
            </Link>
          */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm">
        Need help?{" "}
        <a
          href="mailto:techjartechnologies@gmail.com"
          className="text-[#7B3AED] hover:underline"
        >
          Contact Support
        </a>
      </footer>
    </motion.div>
  );
};

export default Home;
