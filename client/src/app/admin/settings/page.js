'use client';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const adminUser = useSelector((state) => state.app.adminUser);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and platform configurations.</p>
      </div>

      <div className="bg-[#111] rounded-3xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-inner shadow-white/20">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{adminUser?.name || 'Admin User'}</h2>
              <div className="flex items-center gap-2 text-slate-400 mt-1">
                <Shield size={16} className="text-rose-500" />
                <span className="font-medium capitalize">{(adminUser?.role || 'super_admin').replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-bold text-white mb-6">Profile Details</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={adminUser?.name || ''}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={adminUser?.email || ''}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Security (Demo)</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button type="button" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)] w-full justify-center mt-2">
                  <Save size={18} />
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
