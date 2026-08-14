'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Flag } from 'lucide-react';
import { useGetConfigQuery } from '../../redux/api/apiSlice';
import PledgeForm from '../../components/pledge/PledgeForm';
import DonationForm from '../../components/pledge/DonationForm';

function PledgeContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || 1;
  
  const { data: configData } = useGetConfigQuery();
  const siteConfig = configData?.config || {};

  const [status, setStatus] = useState('idle'); // idle, success
  const [pledgeId, setPledgeId] = useState(null);
  
  const handlePledgeSuccess = (id) => {
    setPledgeId(id);
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 py-12 relative">
        {/* Flag gradient background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-[#FF9933]/10 overflow-hidden border border-gray-200 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#FF9933] via-[#E6852E] to-[#138808] p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">Support the Cause</h2>
            <p className="text-white/80 font-medium relative z-10">Your pledge has been recorded. You can optionally support our on-ground initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-[#138808]/5 border border-[#138808]/15 rounded-2xl flex gap-4">
              <ShieldCheck className="text-[#138808] shrink-0 w-8 h-8" />
              <div>
                <h4 className="font-bold text-[#138808] mb-1">How your donation helps</h4>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">
                  {siteConfig.donationUsage || 'Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives.'}
                </p>
              </div>
            </div>
            
            <DonationForm pledgeId={pledgeId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 px-4 sm:px-6 lg:px-8 flex justify-center relative">
      {/* Tricolor top bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />
      
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FF9933]/20 text-sm font-semibold text-[#1a1a1a] mb-4 shadow-sm">
            <Flag size={14} className="text-[#FF9933]" />
            Independence Day 2026 Special
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] tracking-tight mb-2 sm:mb-3">Take the Pledge</h1>
          <p className="text-[#6b7280]">Join the movement and receive your official certificate.</p>
        </div>
        
        <PledgeForm 
          campaignId={campaignId} 
          siteConfig={siteConfig} 
          onSuccess={handlePledgeSuccess} 
        />
      </div>
    </div>
  );
}

export default function PledgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div></div>}>
      <PledgeContent />
    </Suspense>
  );
}
