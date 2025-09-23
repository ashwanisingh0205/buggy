"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

type Plan = {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  { name: "Starter", price: 29, features: ["5 Social Accounts", "Basic Analytics", "Content Calendar", "Email Support"] },
  { name: "Pro", price: 79, features: ["15 Social Accounts", "Advanced Analytics", "Team Collaboration", "Priority Support", "Custom Reports"], popular: true },
  { name: "Enterprise", price: 199, features: ["Unlimited Accounts", "White-label Solution", "API Access", "Dedicated Manager", "Custom Integrations"] },
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Flexible Plans for Every<span className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">Vision</span></h2>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">Choose the perfect plan to accelerate your social media journey, tailored to scale with your ambitions and deliver unmatched value and capabilities.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`relative rounded-2xl p-6 bg-white/5 border ${plan.popular ? 'border-indigo-400/40' : 'border-white/10'} backdrop-blur transition-all duration-300`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]">Most Popular</div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="text-3xl font-bold mb-2 text-white">
                ${plan.price}
                <span className="text-sm text-zinc-400"> / month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 shadow-[0_0_24px_rgba(99,102,241,0.35)]' : 'border border-white/15'} w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02]`}>
              {plan.popular ? 'Choose Pro' : 'Get Started'}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;


