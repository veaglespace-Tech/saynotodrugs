'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminLoginMutation, useAdminVerifyOtpMutation } from '../../../redux/api/apiSlice';
import { setCredentials } from '../../../redux/slice/appSlice';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Login, 2 = OTP
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  
  const [adminLogin, { isLoading: isLoggingIn }] = useAdminLoginMutation();
  const [adminVerifyOtp, { isLoading: isVerifying }] = useAdminVerifyOtpMutation();

  useEffect(() => {
    if (token) {
      router.push('/admin');
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await adminLogin({ email, password }).unwrap();
      if (res.success && res.requiresOtp) {
        setStep(2); // Move to OTP step
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Invalid credentials or server error.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await adminVerifyOtp({ email, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Invalid or expired OTP.');
    }
  };

  if (token) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Tricolor top bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#FF9933]/8 blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#138808]/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200 shadow-xl">
            <Lock className="text-[#FF9933] h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Admin Portal</h1>
          <p className="text-[#6b7280] mt-2">Sign in to manage campaigns & donations</p>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-2xl shadow-[#FF9933]/5">
          {/* Tricolor top accent */}
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          
          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6b7280]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#FF9933] focus:border-transparent outline-none transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#6b7280]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#FF9933] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl text-sm">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_25px_-5px_rgba(255,153,51,0.4)] text-sm font-bold text-white bg-[#FF9933] hover:bg-[#E6852E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9933] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'VERIFYING...' : 'CONTINUE'}
                {!isLoggingIn && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-[#4a4a4a]">
                  We sent a 6-digit verification code to<br />
                  <span className="font-bold">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Verification Code (OTP)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-[#6b7280]" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-11 pr-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#FF9933] focus:border-transparent outline-none transition-all text-center tracking-widest font-mono text-lg"
                    placeholder="000000"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl text-sm">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_25px_-5px_rgba(255,153,51,0.4)] text-sm font-bold text-white bg-[#138808] hover:bg-[#0F6B06] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#138808] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'VERIFYING...' : 'SECURE LOGIN'}
                {!isVerifying && <Lock size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setErrorMsg('');
                }}
                className="w-full text-center text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
        
        <p className="text-center text-[#6b7280] text-sm mt-8">
          Secure Access Only. Protected by Veagle Space.
        </p>
      </div>
    </div>
  );
}
