'use client'
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Users, TrendingUp, BarChart3, Calendar, MessageSquare, Heart, Share2, Eye, ArrowRight, Play, Zap, Target, Globe, Shield } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaGithub, FaWhatsapp, FaDiscord, FaPinterest, FaRedditAlien, FaSlack, FaGoogle, FaTrello, FaAws } from "react-icons/fa";
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  
  const features = [
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights" },
    { icon: Calendar, title: "Content Scheduler", desc: "Plan ahead efficiently" },
    { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly" },
    { icon: TrendingUp, title: "Growth Tracking", desc: "Monitor your progress" }
  ];

const integrations = [
  { name: "YouTube", color: "from-red-600 to-red-400", icon: <FaYoutube /> },
  { name: "Instagram", color: "from-pink-500 to-purple-500", icon: <FaInstagram /> },
  { name: "Facebook", color: "from-blue-600 to-blue-400", icon: <FaFacebookF /> },
  { name: "Twitter", color: "from-sky-500 to-sky-400", icon: <FaTwitter /> },
  { name: "LinkedIn", color: "from-blue-800 to-blue-600", icon: <FaLinkedinIn /> },
];

  const testimonials = [
    { name: "Sarah Chen", role: "Marketing Director", company: "TechCorp", content: "This platform transformed our social media strategy completely.", avatar: "SC" },
    { name: "Mike Johnson", role: "Content Creator", company: "CreativeStudio", content: "The analytics insights helped us grow our audience by 300%.", avatar: "MJ" },
    { name: "Lisa Rodriguez", role: "Social Media Manager", company: "BrandForce", content: "Scheduling content has never been this intuitive and powerful.", avatar: "LR" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 29,
      features: ["5 Social Accounts", "Basic Analytics", "Content Calendar", "Email Support"],
      popular: false
    },
    {
      name: "Pro",
      price: 79,
      features: ["15 Social Accounts", "Advanced Analytics", "Team Collaboration", "Priority Support", "Custom Reports"],
      popular: true
    },
    {
      name: "Enterprise",
      price: 199,
      features: ["Unlimited Accounts", "White-label Solution", "API Access", "Dedicated Manager", "Custom Integrations"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
      {/* Colored blurred circles */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

      {/* Floating social media icons */}
      <FaFacebookF className="absolute top-20 left-10 text-blue-600 text-4xl opacity-80 animate-float-slow" />
      <FaYoutube className="absolute top-1/2 left-10 text-red-600 text-5xl opacity-80 animate-float-slow" />
      <FaTwitter className="absolute top-24 left-1/2 text-sky-400 text-3xl opacity-70 animate-bounce" />
      <FaTwitter className="absolute bottom-32 right-16 text-sky-500 text-4xl opacity-80 animate-float" />
      <FaInstagram className="absolute top-1/3 left-1/4 text-pink-500 text-5xl opacity-60 animate-spin-slow" />
      <FaInstagram className="absolute top-1/2 right-1/4 text-pink-400 text-4xl opacity-80 animate-spin-slow" />
      <FaLinkedinIn className="absolute bottom-40 left-40 text-blue-700 text-4xl opacity-70 animate-float" />
      <FaYoutube className="absolute bottom-20 right-1/2 text-red-600 text-4xl opacity-70 animate-bounce delay-700" />

      {/* Extra icons for variety */}
      <FaGithub className="absolute top-10 right-20 text-gray-800 text-3xl opacity-60 animate-float-slow" />
     

      <FaPinterest className="absolute top-1/4 right-10 text-red-500 text-4xl opacity-65 animate-spin-slow" />


      {/* Custom slow animations */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>

      {/* Navigation */}
    <Navbar/>

      {/* Hero Section */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Your social media
            <br />
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
              workspace
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Unleash the Power of AI-Driven Marketing with seamless integrations and intelligent automation
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border border-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-400/10 transition-all duration-300 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, index) => (
              <div key={item} className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${800 + index * 100}ms` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-400 flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{12 + index * 3}%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics {index + 1}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Engagement</span>
                    <span>{(85 + index * 2)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000`} style={{ width: `${85 + index * 2}%` }}></div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{(1200 + index * 300)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{(89 + index * 15)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4" />
                    <span>{(45 + index * 8)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Seamlessly Integrate and Optimize
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect all your social platforms and leverage AI-powered insights to maximize your reach and engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Target, title: "Smart Targeting", desc: "AI-powered audience segmentation for maximum impact" },
            { icon: Globe, title: "Global Reach", desc: "Expand your presence across all major social platforms" },
            { icon: Shield, title: "Brand Safety", desc: "Protect your brand with intelligent content monitoring" },
            { icon: Zap, title: "Automation", desc: "Streamline workflows with intelligent automation" },
            { icon: BarChart3, title: "Deep Analytics", desc: "Comprehensive insights into your social performance" },
            { icon: Users, title: "Team Sync", desc: "Collaborate seamlessly with your entire team" }
          ].map((feature, index) => (
            <div key={index} className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Integration Showcase */}
         <div className="text-center mb-16">
      <h3 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
        Powerful Integrations
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        Connect your workflow with the tools you already use. Seamless integrations
        to supercharge productivity.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className={`relative group bg-gradient-to-r ${integration.color} p-6 rounded-2xl text-white font-semibold min-w-[140px] shadow-lg transform transition-all duration-500 hover:scale-110 hover:shadow-2xl`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl group-hover:scale-125 transition-transform duration-300">
                {integration.icon}
              </div>
              {/* Name */}
              <span className="text-lg">{integration.name}</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 bg-white blur-2xl transition duration-500"></div>
          </div>
        ))}
      </div>
    </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.content}"</p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Flexible Plans for Everyone</h2>
          <p className="text-xl text-gray-300">Choose the perfect plan to accelerate your social media growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`relative bg-gray-800/40 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${plan.popular ? 'border-purple-500 bg-gray-800/60' : 'border-gray-700/50'}`}>
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
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25' : 'border border-gray-600 hover:bg-gray-700'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Driven.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Start managing smarter with
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your social media strategy with intelligent automation and insights that drive real results.
          </p>
          <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-4 rounded-full text-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto">
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer */}
<Footer/>
    </div>
  );
};

export default Home;