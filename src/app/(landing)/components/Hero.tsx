"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Hero: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-40">
      {/* Floating social icons */}
      <div className="pointer-events-none absolute inset-0">
        <FaFacebookF className="absolute top-10 left-8 text-indigo-400/40 text-2xl animate-float" />
        <FaYoutube className="absolute top-16 right-16 text-rose-400/40 text-3xl animate-float-slow" />
        <FaInstagram className="absolute top-24 left-1/3 text-fuchsia-400/40 text-2xl animate-float-slow" />
        <FaLinkedinIn className="absolute top-40 right-1/4 text-sky-400/40 text-2xl animate-float" />
        <FaTwitter className="absolute top-56 left-24 text-sky-300/40 text-2xl animate-float" />
      </div>
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-[1.1] tracking-tight"
        >
          Your <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">social media</span>
          <br />
          workspace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg text-zinc-300/90 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Share consistently without the chaos
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-full bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
          />
          <button className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-black hover:brightness-105 transition">
            Start free
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Hero;


