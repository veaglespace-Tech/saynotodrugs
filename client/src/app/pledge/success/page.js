'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, FileText, ArrowRight, Flag } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const certId = searchParams.get('cert');

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 relative">
      {/* Tricolor top bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />

      {/* Subtle background glows */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#FF9933]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#138808]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl shadow-[#FF9933]/10 text-center border border-gray-200 relative overflow-hidden animate-scale-in">
        {/* Tricolor top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#138808]/5 blur-3xl rounded-full"></div>

        <div className="w-20 h-20 bg-[#138808]/10 border border-[#138808]/20 text-[#138808] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_25px_-5px_rgba(19,136,8,0.3)]">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black mb-2 relative z-10 text-tricolor drop-shadow-[2px_2px_0_#1a1a1a]">Thank You!</h1>
        <p className="text-[#4a4a4a] mb-2 relative z-10 leading-relaxed">
          Your pledge has been recorded successfully. Together, we can build a drug-free India.
        </p>
        <p className="text-lg font-bold text-tricolor relative z-10 mb-8"> Jai Hind!</p>

        {certId && (
          <div className="bg-[#FFF9F2] p-6 rounded-2xl border border-[#FF9933]/15 mb-8 relative z-10">
            <div className="w-12 h-12 bg-[#FF9933]/15 text-[#FF9933] rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={24} />
            </div>
            <p className="text-sm text-[#6b7280] mb-1">Your Certificate ID</p>
            <p className="font-mono font-bold text-xl text-[#1a1a1a] tracking-wider">{certId}</p>
            <p className="text-xs text-[#FF9933] mt-3 font-medium bg-[#FF9933]/8 py-2 rounded-lg border border-[#FF9933]/15">
              We have sent the certificate PDF to your email.
            </p>
          </div>
        )}

        <Link
          href="/"
          className="relative z-10 inline-flex items-center justify-center w-full bg-[#FF9933] text-white font-bold py-4 rounded-xl shadow-[0_0_25px_-5px_rgba(255,153,51,0.4)] hover:bg-[#E6852E] hover:-translate-y-0.5 transition-all"
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
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
