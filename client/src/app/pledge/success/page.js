'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const certId = searchParams.get('cert');
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-orange-500/30">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl shadow-orange-900/10 text-center border border-slate-300 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-orange-500/10 blur-3xl rounded-full"></div>
        
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 relative z-10">Thank You!</h1>
        <p className="text-slate-600 mb-8 relative z-10 leading-relaxed">
          Your pledge has been recorded successfully. Together, we can build a drug-free society.
        </p>
        
        {certId && (
          <div className="bg-slate-100 p-6 rounded-2xl border border-slate-300 mb-8 relative z-10">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={24} />
            </div>
            <p className="text-sm text-slate-600 mb-1">Your Certificate ID</p>
            <p className="font-mono font-bold text-xl text-slate-900 tracking-wider">{certId}</p>
            <p className="text-xs text-orange-300 mt-3 font-medium bg-orange-500/10 py-2 rounded-lg border border-orange-500/20">
              We have sent the certificate PDF to your email.
            </p>
          </div>
        )}
        
        <Link 
          href="/"
          className="relative z-10 inline-flex items-center justify-center w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] hover:bg-orange-500 hover:-translate-y-0.5 transition-all"
        >
          Return Home
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
