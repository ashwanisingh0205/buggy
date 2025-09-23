'use client'
import { Zap } from 'lucide-react';
import React,{useState,useEffect} from 'react'

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
      const [activeFeature, setActiveFeature] = useState(0);
    
      useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
          setActiveFeature(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
      }, []);
  return (
      <nav className={`relative z-50 p-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              SocialAI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-purple-300 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-purple-300 transition-colors">Contact</a>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>
  )
}

export default Navbar