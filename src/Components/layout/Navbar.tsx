"use client"
import { Zap } from 'lucide-react';
import React,{useState,useEffect} from 'react'
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    
      useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {}, 3000);
        return () => clearInterval(interval);
      }, []);
  return (
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/55 bg-black/70 px-4 md:px-6 py-3 transition-[background,transform,opacity] duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between">
          <a href="#" className="group flex items-center gap-2">
            <motion.div whileHover={{ rotate: 8 }} className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.25)]">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </motion.div>
            <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-indigo-300 via-purple-300 to-sky-300 bg-clip-text text-transparent tracking-tight">
              Bloocube
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {[
              { href: '#features', label: 'Features' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#', label: 'Resources' },
              { href: '#', label: 'Product' },
            ].map((item) => (
              <a key={item.label} href={item.href} className="relative text-zinc-200/90 hover:text-white transition-colors">
                <span className="pb-1">{item.label}</span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <button className="rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-transform duration-300 hover:scale-[1.03]">
              Get Started
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-500/0 via-purple-500/60 to-blue-500/0" />
      </motion.nav>
  )
}

export default Navbar


