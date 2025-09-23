"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, CheckCircle } from 'lucide-react';

const personas = [
  { title: 'Creators', icon: User, benefits: ['Smart Suggestions', 'Auto-scheduling', 'Audience insights'] },
  { title: 'Brands', icon: Building2, benefits: ['Competitor analysis', 'Campaign Manager', 'Team workflows'] },
];

export default function Persona() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Customer <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">Persona</span></h2>
        <p className="text-sm text-zinc-400 mt-2">Include Brands details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{p.title}</h3>
            </div>
            <ul className="space-y-2">
              {p.benefits.map((b) => (
                <li key={b} className="text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


