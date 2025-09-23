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
          {/* Premium diffuse gradient blobs (based on provided reference) */}
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 opacity-35 rounded-full blur-[120px] animate-gradient-45" />
          <div className="absolute top-[30%] -left-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 opacity-35 rounded-full blur-[120px] animate-gradient-60" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-500 opacity-28 rounded-full blur-[140px] animate-gradient-30" />

          {/* Fine noise layer for texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.35\'/%3E%3C/svg%3E")' }} />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
}


