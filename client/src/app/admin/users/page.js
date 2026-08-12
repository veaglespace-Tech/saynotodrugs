'use client';
import { Download, Search, CheckCircle2, Clock } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState } from 'react';

export default function UsersPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const pledges = data?.success ? data.pledges : [];

  const filteredPledges = pledges.filter(p => 
    p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Users & Pledges</h1>
          <p className="text-slate-400 mt-1">Manage and export all campaign participants.</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-rose-900/20">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-[#111] rounded-3xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-[#111]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificate Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-[#111] divide-y divide-white/5">
              {filteredPledges.map((pledge) => (
                <tr key={pledge.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/20">
                        {pledge.user?.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{pledge.user?.name}</div>
                        <div className="text-sm text-slate-400">{pledge.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{pledge.user?.city || '-'}</div>
                    <div className="text-sm text-slate-400">{pledge.user?.state || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {new Date(pledge.pledgeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {pledge.certificates && pledge.certificates.length > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Generated
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-rose-500 hover:text-rose-400 font-medium text-sm">View Details</button>
                  </td>
                </tr>
              ))}
              {filteredPledges.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
