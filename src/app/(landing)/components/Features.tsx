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
    <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Seamlessly Integrate and Optimize
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Connect all your social platforms and leverage AI-powered insights to maximize your reach and engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;


