'use client';
import Link from 'next/link';
import { HeartHandshake, Shield, Users, ArrowRight } from 'lucide-react';
import { useGetCampaignsQuery } from '../redux/api/apiSlice';

export default function Home() {
  const { data, isLoading } = useGetCampaignsQuery();
  const campaign = data?.success ? data.campaigns[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-500/30">
      
      {/* Navbar */}
      <nav className="absolute top-0 w-full p-6 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Veagle Space Logo" className="h-12 w-auto object-contain" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Say No To Drugs</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Abstract Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-emerald-500 blur-[100px] rounded-full mix-blend-multiply animate-pulse duration-10000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            Join the National Movement
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Choose Life. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-emerald-600">
              Not Drugs.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {campaign?.description || 'Take a stand against substance abuse. Pledge today to build a healthier, safer, and drug-free society for our future generations.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link 
              href="/pledge" 
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.7)] hover:-translate-y-1"
            >
              Take the Pledge
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Stats Card */}
          {data?.stats && (
            <div className="mt-16 mx-auto max-w-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 shadow-xl shadow-slate-200/20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
              <div className="grid grid-cols-2 gap-8 divide-x divide-slate-200/50">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-700 mb-2">
                    {data.stats.totalPledges.toLocaleString()}
                  </span>
                  <span className="text-sm md:text-base font-bold text-slate-600 uppercase tracking-wider">
                    Total Pledges
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-emerald-700 mb-2">
                    ₹{data.stats.totalDonations.toLocaleString()}
                  </span>
                  <span className="text-sm md:text-base font-bold text-slate-600 uppercase tracking-wider">
                    Funds Raised
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Stats/Features Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield}
              title="Protect the Youth"
              desc="Drugs destroy potential. By saying no, you protect the dreams and ambitions of millions of youth."
            />
            <FeatureCard 
              icon={Users}
              title="Build Communities"
              desc="A drug-free society fosters safer neighborhoods, stronger families, and united communities."
            />
            <FeatureCard 
              icon={HeartHandshake}
              title="Support & Heal"
              desc="Your pledges and donations directly fund de-addiction camps and women safety initiatives."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>All Rights Reserved © {new Date().getFullYear()} Veagle Space Technology Pvt. Ltd.</p>
          <p className="mt-2">Designed & Developed by Veagle Space Technology Pvt. Ltd.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
