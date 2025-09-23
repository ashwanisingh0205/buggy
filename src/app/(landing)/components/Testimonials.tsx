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
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-400">{t.role} at {t.company}</p>
              </div>
            </div>
            <p className="text-gray-300 italic">&ldquo;{t.content}&rdquo;</p>
            <div className="flex text-yellow-400 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;


