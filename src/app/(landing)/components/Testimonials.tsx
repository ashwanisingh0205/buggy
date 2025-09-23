"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

type Testimonial = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  { name: "Sarah Chen", role: "Marketing Director", company: "TechCorp", content: "This platform transformed our social media strategy completely.", avatar: "SC" },
  { name: "Mike Johnson", role: "Content Creator", company: "CreativeStudio", content: "The analytics insights helped us grow our audience by 300%.", avatar: "MJ" },
  { name: "Lisa Rodriguez", role: "Social Media Manager", company: "BrandForce", content: "Scheduling content has never been this intuitive and powerful.", avatar: "LR" },
];

const Testimonials: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">What Our <span className="bg-gradient-to-r from-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">Leaders</span> Say</h2>
        <p className="text-sm text-zinc-400 mt-2">Hear from industry pioneers who trust us to steer social media management, benefiting from our innovative solutions and dedicated support.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur hover:border-white/20 transition"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center text-xs font-bold mr-4">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-zinc-400">{t.role} at {t.company}</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm">&ldquo;{t.content}&rdquo;</p>
            <div className="flex text-yellow-400 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;


