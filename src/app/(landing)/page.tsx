"use client";
import React from 'react';
import Hero from './components/Hero';
import Persona from './components/Persona';
import Features from './components/Features';
import Automation from './components/Automation';
import Visualization from './components/Visualization';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Persona />
      <Features />
      <Automation />
      <Visualization />
      <Testimonials />
      <Pricing />
    </>
  );
}


