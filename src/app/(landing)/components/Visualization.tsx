"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Visualization() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Visualize Your <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Success</span></h2>
        <p className="text-sm text-zinc-400 mt-2">Explore our intuitive dashboards and powerful tools crafted to deliver a seamless and insightful user experience, bringing your data to life.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'AI Analytics Dashboard' },
          { label: 'Dynamic Content Planner' },
          { label: 'Campaign Manager' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur h-56 overflow-hidden"
          >
            <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_40%)] hover:scale-[1.01] transition-transform duration-300" />
            <div className="px-4 py-2 text-xs text-zinc-300">{card.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


