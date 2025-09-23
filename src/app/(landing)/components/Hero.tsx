"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight"
        >
          Your social media
          <br />
          <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
            workspace
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Unleash the Power of AI-Driven Marketing with seamless integrations and intelligent automation
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group border border-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-400/10 transition-all duration-300 flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


