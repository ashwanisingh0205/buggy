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
    <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Flexible Plans for Everyone</h2>
        <p className="text-xl text-gray-300">Choose the perfect plan to accelerate your social media growth</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`relative bg-gray-800/40 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${plan.popular ? 'border-purple-500 bg-gray-800/60' : 'border-gray-700/50'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-2">
                ${plan.price}
                <span className="text-lg text-gray-400">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25' : 'border border-gray-600 hover:bg-gray-700'} w-full py-3 rounded-full font-semibold transition-all duration-300`}>
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;


