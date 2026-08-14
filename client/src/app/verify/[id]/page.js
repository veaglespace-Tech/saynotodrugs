'use client';
import { useParams } from 'next/navigation';
import { useVerifyCertificateQuery } from '../../../redux/api/apiSlice';
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function VerifyPage({ params }) {
  // Unwrap params in next 15+ if needed, but in standard client component `params.id` might work directly or require unwrapping.
  // Using React.use to unwrap promise if it is one in next 15, or just accessing if it's sync.
  const unwrappedParams = typeof params.then === 'function' ? use(params) : params;
  const certId = unwrappedParams.id;
  
  const { data, isLoading, error } = useVerifyCertificateQuery(certId, {
    skip: !certId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  const isVerified = data?.success;

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 relative">
      {/* Tricolor top bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />
      
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl shadow-[#FF9933]/10 text-center border border-gray-200 relative overflow-hidden animate-scale-in">
        {/* Tricolor top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        {/* Subtle background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-3xl rounded-full ${isVerified ? 'bg-[#138808]/5' : 'bg-red-500/5'}`}></div>
        
        {isVerified ? (
          <>
            <div className="w-20 h-20 bg-[#138808]/10 border border-[#138808]/20 text-[#138808] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_25px_-5px_rgba(19,136,8,0.3)]">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2 relative z-10">Verified! 🇮🇳</h1>
            <p className="text-[#4a4a4a] mb-8 relative z-10 leading-relaxed">
              This certificate is authentic and registered in our database.
            </p>
            
            <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-200 mb-8 relative z-10 text-left space-y-4">
              <div>
                <p className="text-xs text-[#6b7280] font-bold uppercase tracking-wider mb-1">Pledge Taker</p>
                <p className="font-bold text-lg text-[#1a1a1a]">{data.data.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] font-bold uppercase tracking-wider mb-1">Certificate ID</p>
                <p className="font-mono font-medium text-[#4a4a4a]">{data.data.certificateId}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] font-bold uppercase tracking-wider mb-1">Issuance Date</p>
                <p className="font-medium text-[#4a4a4a]">{data.data.date}</p>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#138808]" />
                <span className="text-sm font-bold text-[#138808]">Official Record</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)]">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2 relative z-10">Invalid Certificate</h1>
            <p className="text-[#4a4a4a] mb-8 relative z-10 leading-relaxed">
              We could not find a record matching this certificate ID. It may be invalid or forged.
            </p>
            
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8 relative z-10">
              <p className="font-mono text-sm text-red-500">{certId}</p>
            </div>
          </>
        )}
        
        <Link 
          href="/"
          className="relative z-10 inline-flex items-center justify-center w-full bg-[#FF9933] text-white font-bold py-4 rounded-xl shadow-[0_0_25px_-5px_rgba(255,153,51,0.4)] hover:bg-[#E6852E] hover:-translate-y-0.5 transition-all"
        >
          Return to Home
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
