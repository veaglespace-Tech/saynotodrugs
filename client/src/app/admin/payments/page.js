'use client';
import { Download, Search, CheckCircle2, XCircle, Clock, X, User, Mail, Phone, IndianRupee, CreditCard, Calendar, FileText, Hash } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState } from 'react';

export default function PaymentsPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);

  const pledges = data?.success ? data.pledges : [];
  
  // Flatten donations from pledges for the table
  const allDonations = pledges.flatMap(p => 
    p.donations.map(d => ({
      ...d,
      user: p.user,
      pledgeId: p.id,
      campaign: p.campaign
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
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
          <Download size={18} />
          <span>Export Receipts</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-100">
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
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
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
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedDonation(donation)}
                      className="text-emerald-500 hover:text-emerald-400 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedDonation && (
        <PaymentDetailModal 
          donation={selectedDonation} 
          onClose={() => setSelectedDonation(null)} 
        />
      )}
    </div>
  );
}

function PaymentDetailModal({ donation, onClose }) {
  const user = donation.user;

  const statusColors = {
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'Payment Successful' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', icon: XCircle, label: 'Payment Failed' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', icon: Clock, label: 'Payment Pending' }
  };

  const status = statusColors[donation.paymentStatus] || statusColors.pending;
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Payment Details</h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="text-4xl font-black">₹{donation.amount}</div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text} ${status.border} bg-white/90`}>
              <StatusIcon size={14} />
              {status.label}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Donor Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Donor Information</h4>
            <div className="space-y-2.5">
              <DetailRow icon={User} label="Name" value={user?.name} />
              <DetailRow icon={Mail} label="Email" value={user?.email} />
              <DetailRow icon={Phone} label="Mobile" value={user?.mobile} />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Transaction Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Transaction Details</h4>
            <div className="space-y-2.5">
              <DetailRow icon={Hash} label="TXN ID" value={donation.transactionId || 'N/A'} mono />
              <DetailRow icon={CreditCard} label="Gateway" value={(donation.paymentGateway || 'payu').toUpperCase()} />
              <DetailRow icon={IndianRupee} label="Amount" value={`₹${donation.amount}`} />
              <DetailRow icon={Calendar} label="Date" value={donation.paymentDate ? new Date(donation.paymentDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'} />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Pledge Reference */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pledge Reference</h4>
            <div className="space-y-2.5">
              <DetailRow icon={FileText} label="Pledge ID" value={`#${donation.pledgeId}`} />
              <DetailRow icon={FileText} label="Campaign" value={donation.campaign?.name || '-'} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-slate-400 flex-shrink-0" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 flex-shrink-0">{label}</span>
      <span className={`text-sm text-slate-900 font-medium ${mono ? 'font-mono' : ''}`}>{value || '-'}</span>
    </div>
  );
}
