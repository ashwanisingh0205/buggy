"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Shield, Zap, BarChart3, Users } from 'lucide-react';

const features = [
  { icon: Target, title: "Smart Targeting", desc: "AI-powered audience segmentation for maximum impact" },
  { icon: Globe, title: "Global Reach", desc: "Expand your presence across all major social platforms" },
  { icon: Shield, title: "Brand Safety", desc: "Protect your brand with intelligent content monitoring" },
  { icon: Zap, title: "Automation", desc: "Streamline workflows with intelligent automation" },
  { icon: BarChart3, title: "Deep Analytics", desc: "Comprehensive insights into your social performance" },
  { icon: Users, title: "Team Sync", desc: "Collaborate seamlessly with your entire team" },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Unleash the Power of <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">AI-Driven</span> Marketing</h2>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">Transform your social media strategy with our cutting-edge features, designed to enable comprehensive control and predictive insights for unparalleled growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur hover:border-white/20 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;


