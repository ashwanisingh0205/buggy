"use client"
import { Zap, Menu, X } from 'lucide-react';
import Button from '@/Components/ui/Button';
import React,{useState,useEffect} from 'react'
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [open, setOpen] = useState(false);
    
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
        className={`sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur supports-[backdrop-filter]:bg-black/55 bg-black/70 px-4 md:px-6 py-2.5 transition-[background,transform,opacity] duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto flex h-12 md:h-14 items-center justify-between">
          <a href="#" className="group flex items-center gap-2">
            <motion.div whileHover={{ rotate: 6 }} className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.25)]">
              <Zap className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
            </motion.div>
            <span className="text-base md:text-lg font-semibold bg-gradient-to-r from-indigo-300 via-purple-300 to-sky-300 bg-clip-text text-transparent tracking-tight">
              Bloocube
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm">
            {[
              { href: '#features', label: 'Features' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#', label: 'Resources' },
              { href: '#', label: 'Product' },
            ].map((item) => (
              <a key={item.label} href={item.href} className="group relative text-zinc-300/90 hover:text-white transition-colors">
                <span className="pb-1">{item.label}</span>
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Button size="sm" className="px-5 py-2">Get Started</Button>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle navigation"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.04] p-2 text-white hover:bg-white/[0.07] transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile panel */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur px-4 py-3">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#features" className="text-zinc-300 hover:text-white transition" onClick={() => setOpen(false)}>Features</a>
              <a href="#pricing" className="text-zinc-300 hover:text-white transition" onClick={() => setOpen(false)}>Pricing</a>
              <a href="#" className="text-zinc-300 hover:text-white transition" onClick={() => setOpen(false)}>Resources</a>
              <a href="#" className="text-zinc-300 hover:text-white transition" onClick={() => setOpen(false)}>Product</a>
              <Button size="sm" className="mt-1 px-4 py-2 w-full">Get Started</Button>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-500/0 via-purple-500/60 to-blue-500/0" />
      </motion.nav>
  )
}

export default Navbar


