import React, { useState } from "react";
import LogoLoop from "./LogoLoop";
import GradualBlur from "./GradualBlur";
import { Link } from "react-router-dom";
import logo from "../assets/logobot.png";
import CardNav from "./CardNav";
import FloatingLines from "./FloatingLines";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiKubernetes,
} from "react-icons/si";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiPython />, title: "Python", href: "https://python.org" },
  { node: <SiDocker />, title: "Docker", href: "https://docker.com" },
  {
    node: <SiKubernetes />,
    title: "Kubernetes",
    href: "https://kubernetes.io",
  },
];

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Team", ariaLabel: "About Team" },
        { label: "Careers", ariaLabel: "About Careers" },
      ],
    },
    {
      label: "Services",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Development", ariaLabel: "Development Services" },
        { label: "Consulting", ariaLabel: "Consulting Services" },
        { label: "Support", ariaLabel: "Support Services" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#1e1b4b",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" },
        { label: "Portfolio", ariaLabel: "Portfolio" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Floating Lines Background */}
      <div className="absolute inset-0 w-full h-full">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[5, 5, 5]}
          lineDistance={[5, 5, 5]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-black to-blue-950/30"></div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className=" h-12 w-12 flex items-center justify-center">
                <img
                  src={logo}
                  alt="TechJar Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-2xl">TeleBot </span>
              <p className="text-white text-xs">
                Your AI-powered calling assistant
              </p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="https://techjar.in/"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                About
              </a>

              <a
                href="mailto:info@techjar.in"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* CTA Button */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
              <div className="flex flex-col gap-4">
                <a
                  href="https://techjar.in/"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  About
                </a>
                <a
                  href="mailto:info@techjar.in"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Content container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center flex-1 flex flex-col justify-center">
            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-2 text-white">
              Discover TeleBot
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-5xl mt-2 px-2 py-2">
                Create smarter conversations
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              From outbound calling to Smart Replies, streamline every step of
              your communication journey
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/outbound-call"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                Try Outbond-call
              </Link>
{/* 
              <Link
                to="/inbound-call"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                Try Web Call
              </Link> */}

              {/* <Link
                to="/manage-assist"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                Manage assistants
              </Link> */}

              {/* <Link
                to="/knowledge-base-upload"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                Create assistant
              </Link> */}

              <Link
                to="/call-logs"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg font-semibold text-white hover:bg-white/10 transition-all"
              >
                Call logs
              </Link>
            </div>
          </div>

          {/* Technology Partners Section - Integrated at bottom of hero */}
          <div className="w-full pb-8">
            <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
             Developed  by TechJar Technologies
            </p>

            {/* Logo Loop container */}
            <div
              className="relative"
              style={{ height: "100px", overflow: "hidden" }}
            >
              {/* Logo loop */}
              <div className="h-full w-full relative flex items-center [&_svg]:text-white [&_svg]:fill-white [&_*]:text-white [&_svg]:opacity-60 [&_svg]:hover:opacity-100 [&_svg]:transition-opacity">
                <LogoLoop
                  logos={techLogos}
                  speed={80}
                  direction="left"
                  logoHeight={40}
                  gap={60}
                  hoverSpeed={0}
                  scaleOnHover
                  fadeOut={false}
                  ariaLabel="Technology partners"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
