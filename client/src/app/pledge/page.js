'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeartHandshake, ShieldCheck } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-orange-900/20 overflow-hidden border border-slate-300">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">Support the Cause</h2>
            <p className="text-orange-100 font-medium relative z-10">Your pledge has been recorded. You can optionally support our on-ground initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl flex gap-4 text-emerald-50">
              <ShieldCheck className="text-emerald-400 shrink-0 w-8 h-8" />
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">How your donation helps</h4>
                <p className="text-sm text-emerald-100/70 leading-relaxed">
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center selection:bg-orange-500/30">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Veagle Space Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Take the Pledge</h1>
          <p className="text-slate-600">Join the movement and receive your official certificate.</p>
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>}>
      <PledgeContent />
    </Suspense>
  );
}
