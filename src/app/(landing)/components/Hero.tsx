"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Hero: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-28 md:pb-36">
      {/* Minimal, tasteful icon accents (hidden on very small screens) */}
      <div className="pointer-events-none absolute inset-0">
        <FaFacebookF className="hidden sm:block absolute top-16 left-4 sm:left-8 text-indigo-400/20 text-base sm:text-xl animate-float" />
        <FaYoutube className="hidden sm:block absolute top-20 right-2 sm:right-10 text-rose-400/20 text-lg sm:text-2xl animate-float-slow" />
        <FaInstagram className="hidden sm:block absolute top-28 left-1/5 sm:left-1/3 text-fuchsia-400/20 text-base sm:text-xl animate-float-slow" />
        <FaLinkedinIn className="hidden sm:block absolute top-36 right-1/6 sm:right-1/4 text-sky-400/20 text-base sm:text-xl animate-float" />
        <FaTwitter className="hidden sm:block absolute top-52 left-6 sm:left-24 text-sky-300/20 text-base sm:text-xl animate-float" />
      </div>
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold mb-4 text-white leading-[1.1] sm:leading-[1.08] md:leading-[1.05] tracking-[-0.01em] sm:tracking-[-0.015em] md:tracking-[-0.02em] max-w-4xl mx-auto px-1"
        >
          Your <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">social media</span> workspace
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10.5px] sm:text-[11px] text-zinc-300 backdrop-blur"
        >
          AI-powered social marketing OS
          <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
          Ship content with confidence
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-[15px] md:text-base text-zinc-300/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-1"
        >
          Operate campaigns, insights, and publishing from one streamlined system. Enterprise-grade security, delightful UX.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto flex w-full max-w-md sm:max-w-xl flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 rounded-full sm:rounded-full border border-white/10 bg-white/[0.04] p-2 backdrop-blur px-2 sm:px-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Work email"
            className="flex-1 bg-transparent px-3 sm:px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none w-full"
          />
          <button className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 sm:px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:scale-[1.02] transition w-full sm:w-auto">
            Start free trial
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-3 sm:mt-4 text-[10.5px] sm:text-[11px] text-zinc-500 px-1"
        >
          By continuing you agree to our Terms and Privacy Policy.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-6 sm:mt-8 flex max-w-lg sm:max-w-xl flex-wrap items-center justify-center gap-2.5 sm:gap-4 opacity-80 px-1"
        >
          <span className="text-[10.5px] sm:text-[11px] text-zinc-500">Trusted by teams at</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10.5px] sm:text-[11px] text-zinc-300">Acme Co.</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10.5px] sm:text-[11px] text-zinc-300">Vertex Labs</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10.5px] sm:text-[11px] text-zinc-300">Northstar</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10.5px] sm:text-[11px] text-zinc-300">Everline</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


