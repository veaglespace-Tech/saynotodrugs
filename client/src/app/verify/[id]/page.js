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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const isVerified = data?.success;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-rose-500/30">
      <div className="max-w-md w-full bg-[#111] p-8 rounded-3xl shadow-2xl shadow-rose-900/10 text-center border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-3xl rounded-full ${isVerified ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}></div>
        
        {isVerified ? (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 relative z-10">Verified!</h1>
            <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
              This certificate is authentic and registered in our database.
            </p>
            
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 relative z-10 text-left space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pledge Taker</p>
                <p className="font-bold text-lg text-white">{data.data.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Certificate ID</p>
                <p className="font-mono font-medium text-slate-300">{data.data.certificateId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Issuance Date</p>
                <p className="font-medium text-slate-300">{data.data.date}</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">Official Record</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 relative z-10">Invalid Certificate</h1>
            <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
              We could not find a record matching this certificate ID. It may be invalid or forged.
            </p>
            
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10 mb-8 relative z-10">
              <p className="font-mono text-sm text-red-400">{certId}</p>
            </div>
          </>
        )}
        
        <Link 
          href="/"
          className="relative z-10 inline-flex items-center justify-center w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all border border-white/10"
        >
          Return to Home
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
