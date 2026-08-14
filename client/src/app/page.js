'use client';
import Link from 'next/link';
import { HeartHandshake, Shield, Users, ArrowRight, Flag, Star } from 'lucide-react';
import { useGetCampaignsQuery } from '../redux/api/apiSlice';

export default function Home() {
  const { data, isLoading } = useGetCampaignsQuery();
  const campaign = data?.success ? data.campaigns[0] : null;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">

      {/* Tricolor Top Accent Bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] fixed top-0 z-50" />

      {/* Navbar */}
      <nav className="fixed top-1.5 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Veagle Space Logo" className="h-10 sm:h-14 w-auto object-contain" />
            <span className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">Say No To Drugs</span>
          </div>
          <Link
            href="/pledge"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FF9933] hover:bg-[#E6852E] text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-[#FF9933]/20 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Take Pledge
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Flag Background */}
      <main className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden flag-bg min-h-[90vh] flex items-center">

        {/* Indian Flag — Saffron Band (Top) */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FF9933]/10 to-transparent pointer-events-none" />

        {/* Indian Flag — Green Band (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#138808]/10 to-transparent pointer-events-none" />

        {/* Floating Ashoka Chakra Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08]">
          <svg viewBox="0 0 200 200" className="w-[600px] h-[600px] animate-spin-slow" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="#000080" strokeWidth="3" />
            <circle cx="100" cy="100" r="15" fill="#000080" />
            {[...Array(24)].map((_, i) => (
              <line key={i} x1="100" y1="25" x2="100" y2="85" stroke="#000080" strokeWidth="2" transform={`rotate(${i * 15} 100 100)`} />
            ))}
          </svg>
        </div>

        {/* Decorative Saffron Blob */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FF9933]/8 rounded-full blur-[100px] pointer-events-none animate-float" />

        {/* Decorative Green Blob */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#138808]/8 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

          {/* Independence Day Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FFF9F2] border border-[#FF9933]/20 text-[#1a1a1a] font-semibold text-sm mb-8 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span className="w-2 h-2 rounded-full bg-white border border-gray-200" />
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
            </span>
            Independence Day 2026 — National Campaign
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#1a1a1a] tracking-tighter mb-6 leading-[1.05]">
            Drug-Free India, <br />
            <span className="text-tricolor-shimmer">
              Our Pledge.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-[#4a4a4a] max-w-2xl mx-auto mb-10 leading-relaxed">
            {campaign?.description || 'This Independence Day, take a stand against substance abuse. Pledge to build a healthier, stronger, and drug-free India for our future generations.'}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pledge"
              className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 py-5 bg-[#FF9933] hover:bg-[#E6852E] text-white font-bold text-lg rounded-2xl transition-all shadow-[0_0_50px_-12px_rgba(255,153,51,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,153,51,0.6)] hover:-translate-y-1 animate-pulse-glow"
            >
              <Flag size={22} />
              Take the Pledge
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
            </Link>
          </div>

          {/* Stats Card */}
          {data?.stats && (
            <div className="animate-fade-in-up-delay-5 mt-16 mx-auto max-w-2xl glass-card-strong rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Tricolor top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              <div className="grid grid-cols-2 gap-4 sm:gap-8 divide-x divide-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF9933] mb-1 sm:mb-2">
                    {data.stats.totalPledges.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-[#4a4a4a] uppercase tracking-wider text-center">
                    Total Pledges
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#138808] mb-1 sm:mb-2">
                    {data.stats.donorsCount?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-[#4a4a4a] uppercase tracking-wider text-center">
                    Total Donors
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Why This Matters Section */}
      <section className="py-24 bg-[#FAFAFA] relative">
        {/* Tricolor top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-[#FAFAFA] to-[#138808]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tight mb-4">Why This Matters</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">Our freedom is not just from foreign rule — it's freedom from every chain that holds our nation back.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Protect the Youth"
              desc="Drugs destroy potential. By saying no, you protect the dreams and ambitions of millions of youth."
              color="saffron"
            />
            <FeatureCard
              icon={Users}
              title="Build Communities"
              desc="A drug-free society fosters safer neighborhoods, stronger families, and united communities."
              color="navy"
            />
            <FeatureCard
              icon={HeartHandshake}
              title="Support & Heal"
              desc="Your pledges and donations directly fund de-addiction camps and women safety initiatives."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow" fill="none">
            <circle cx="100" cy="100" r="90" stroke="#000080" strokeWidth="1" />
            {[...Array(24)].map((_, i) => (
              <line key={i} x1="100" y1="25" x2="100" y2="85" stroke="#000080" strokeWidth="1" transform={`rotate(${i * 15} 100 100)`} />
            ))}
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <Star className="text-[#FF9933] fill-[#FF9933]" size={18} />
            <Star className="text-[#D4A017] fill-[#D4A017]" size={18} />
            <Star className="text-[#138808] fill-[#138808]" size={18} />
          </div>
          <blockquote className="text-2xl md:text-4xl font-black text-[#1a1a1a] leading-snug tracking-tight mb-6">
            "Freedom is not worth having if it does not include the freedom to make mistakes —
            <span className="text-tricolor"> but choosing drugs is never a mistake worth making.</span>"
          </blockquote>
          <p className="text-[#6b7280] font-medium text-lg">— Inspired by Mahatma Gandhi</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a1a] text-white relative">
        {/* Tricolor top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="text-gray-400 text-sm">Designed & Developed by <a href="https://veaglespace.com" target="_blank" rel="noopener noreferrer" className="text-[#FF9933] hover:text-[#FFB366] transition-colors underline underline-offset-2">Veagle Space Technology Pvt. Ltd.</a> © {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  const colorMap = {
    saffron: {
      iconBg: 'bg-[#FF9933]/10',
      iconColor: 'text-[#FF9933]',
      borderHover: 'hover:border-[#FF9933]/30',
      shadowHover: 'hover:shadow-[#FF9933]/5',
    },
    green: {
      iconBg: 'bg-[#138808]/10',
      iconColor: 'text-[#138808]',
      borderHover: 'hover:border-[#138808]/30',
      shadowHover: 'hover:shadow-[#138808]/5',
    },
    navy: {
      iconBg: 'bg-[#000080]/10',
      iconColor: 'text-[#000080]',
      borderHover: 'hover:border-[#000080]/30',
      shadowHover: 'hover:shadow-[#000080]/5',
    },
  };

  const c = colorMap[color];

  return (
    <div className={`p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl ${c.borderHover} ${c.shadowHover} transition-all duration-300 group`}>
      <div className={`w-14 h-14 ${c.iconBg} ${c.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{title}</h3>
      <p className="text-[#4a4a4a] leading-relaxed">{desc}</p>
    </div>
  );
}
