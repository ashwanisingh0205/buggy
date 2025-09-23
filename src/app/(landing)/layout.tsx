import React from 'react';
import Navbar from '@/Components/layout/Navbar';
import Footer from '@/Components/layout/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="relative z-10">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Static vignette gradients (subtle, professional) */}
          <div className="absolute inset-0 bg-[radial-gradient(80rem_60rem_at_85%_-10%,rgba(124,58,237,0.10),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(70rem_50rem_at_-10%_90%,rgba(147,51,234,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(90rem_70rem_at_50%_20%,rgba(99,102,241,0.05),transparent_65%)]" />

          {/* Animated premium gradient orbs (purple-focused) */}
          <div
            className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.7), rgba(139,92,246,0) 60%)' }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -right-40 w-[42rem] h-[42rem] rounded-full blur-[68px] opacity-22 animate-float-slow"
            style={{ background: 'radial-gradient(circle at 70% 40%, rgba(168,85,247,0.55), rgba(168,85,247,0) 60%)' }}
            aria-hidden="true"
          />
          {/* Cyan accent reduced to keep focus on purple */}
          <div
            className="absolute bottom-[-12rem] left-1/4 w-[46rem] h-[46rem] rounded-full blur-[70px] opacity-14 animate-float"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.35), rgba(56,189,248,0) 60%)' }}
            aria-hidden="true"
          />

          {/* Soft purple sweep highlight */}
          <div className="absolute -inset-1 bg-[linear-gradient(115deg,rgba(124,58,237,0)_0%,rgba(124,58,237,0.14)_38%,rgba(168,85,247,0.14)_62%,rgba(124,58,237,0)_100%)] animate-sweep opacity-20" />

          {/* Fine noise layer for texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.35\'/%3E%3C/svg%3E")' }} />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
}


