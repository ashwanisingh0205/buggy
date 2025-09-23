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
      <div className="relative">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Static vignette gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.08),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_45%)]" />

          {/* Animated premium gradient orbs */}
          <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
               style={{ background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.7), rgba(99,102,241,0) 60%)' }}
               aria-hidden="true">
          </div>
          <div className="absolute top-1/3 -right-40 w-[42rem] h-[42rem] rounded-full blur-[64px] opacity-20 animate-float-slow"
               style={{ background: 'radial-gradient(circle at 70% 40%, rgba(168,85,247,0.6), rgba(168,85,247,0) 60%)' }}
               aria-hidden="true">
          </div>
          <div className="absolute bottom-[-12rem] left-1/4 w-[50rem] h-[50rem] rounded-full blur-[72px] opacity-20 animate-float"
               style={{ background: 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.5), rgba(14,165,233,0) 60%)' }}
               aria-hidden="true">
          </div>

          {/* Soft glow sweep */}
          <div className="absolute -inset-1 bg-[linear-gradient(120deg,rgba(99,102,241,0)_0%,rgba(99,102,241,0.12)_40%,rgba(236,72,153,0.12)_60%,rgba(14,165,233,0)_100%)] animate-sweep opacity-20" />

          {/* Fine noise layer for texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.35\'/%3E%3C/svg%3E")' }} />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
}


