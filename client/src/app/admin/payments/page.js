'use client';
import { Download, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState } from 'react';

export default function PaymentsPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const pledges = data?.success ? data.pledges : [];
  
  // Flatten donations from pledges for the table
  const allDonations = pledges.flatMap(p => 
    p.donations.map(d => ({
      ...d,
      user: p.user,
      pledgeId: p.id
    }))
  ).sort((a, b) => new Date(b.paymentDate || b.id) - new Date(a.paymentDate || a.id));

  const filteredDonations = allDonations.filter(d => 
    d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Donations</h1>
          <p className="text-slate-600 mt-1">Track all contributions made towards the campaign.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-slate-900 px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
          <Download size={18} />
          <span>Export Receipts</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-slate-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by donor name or TXN ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-white/5">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{donation.user?.name}</div>
                    <div className="text-sm text-slate-600">{donation.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold text-emerald-500">₹{donation.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-300">
                      {donation.transactionId || 'N/A'}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {donation.paymentDate ? new Date(donation.paymentDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {donation.paymentStatus === 'success' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Success
                      </div>
                    ) : donation.paymentStatus === 'failed' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle size={14} /> Failed
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No donations found.
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
