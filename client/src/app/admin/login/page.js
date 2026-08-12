'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAdminLoginMutation } from '../../../redux/api/apiSlice';
import { setCredentials } from '../../../redux/slice/appSlice';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  useEffect(() => {
    if (token) {
      router.push('/admin');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await adminLogin({ email, password }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Invalid credentials or server error.');
    }
  };

  if (token) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-orange-900/20 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-slate-300 shadow-2xl">
            <Lock className="text-orange-500 h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-orange-200/70 mt-2">Sign in to manage campaigns & donations</p>
        </div>

        <div className="bg-slate-100 backdrop-blur-2xl border border-slate-300 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-orange-300 bg-orange-900/30 border border-orange-500/30 p-4 rounded-xl text-sm">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-[#0a0a0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-8">
          Secure Access Only. Protected by Veagle Space.
        </p>
      </div>
    </div>
  );
}
