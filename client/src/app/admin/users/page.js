'use client';
import { Download, Search, CheckCircle2, Clock, X, User, Mail, Phone, MapPin, Briefcase, FileText, IndianRupee, Calendar } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState } from 'react';

export default function UsersPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPledge, setSelectedPledge] = useState(null);

  const pledges = data?.success ? data.pledges : [];

  const filteredPledges = pledges.filter(p => 
    p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Users & Pledges</h1>
          <p className="text-slate-600 mt-1">Manage and export all campaign participants.</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20">
          <Download size={18} />
          <span>Export CSV</span>
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
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificate Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredPledges.map((pledge) => (
                <tr key={pledge.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/20">
                        {pledge.user?.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{pledge.user?.name}</div>
                        <div className="text-sm text-slate-600">{pledge.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{pledge.user?.city || '-'}</div>
                    <div className="text-sm text-slate-600">{pledge.user?.state || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
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
                    <button 
                      onClick={() => setSelectedPledge(pledge)}
                      className="text-orange-500 hover:text-orange-400 font-medium text-sm"
                    >
                      View Details
                    </button>
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

      {/* User Detail Modal */}
      {selectedPledge && (
        <UserDetailModal 
          pledge={selectedPledge} 
          onClose={() => setSelectedPledge(null)} 
        />
      )}
    </div>
  );
}

function UserDetailModal({ pledge, onClose }) {
  const user = pledge.user;
  const donations = pledge.donations || [];
  const certificates = pledge.certificates || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">User Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                <p className="text-sm text-slate-600 capitalize">{user?.profession || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <DetailRow icon={Mail} label="Email" value={user?.email} />
              <DetailRow icon={Phone} label="Mobile" value={user?.mobile} />
              <DetailRow icon={Briefcase} label="Profession" value={user?.profession || '-'} />
              <DetailRow icon={MapPin} label="City" value={user?.city || '-'} />
              <DetailRow icon={MapPin} label="State" value={user?.state || '-'} />
              <DetailRow icon={Calendar} label="Registered" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'} />
            </div>
          </div>

          {/* Pledge Info */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-orange-500" />
                Pledge Information
              </h4>
            </div>
            <div className="p-5 space-y-3">
              <DetailRow icon={Calendar} label="Pledge Date" value={new Date(pledge.pledgeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
              <DetailRow icon={FileText} label="Language" value={pledge.language ? pledge.language.charAt(0).toUpperCase() + pledge.language.slice(1) : '-'} />
              <DetailRow icon={FileText} label="Campaign" value={pledge.campaign?.name || '-'} />
              {pledge.pledgeText && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pledge Text</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">{pledge.pledgeText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Certificates ({certificates.length})
              </h4>
            </div>
            <div className="p-5">
              {certificates.length > 0 ? (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div>
                        <code className="text-xs font-mono bg-white px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">{cert.certificateNumber}</code>
                        <p className="text-xs text-slate-600 mt-1">
                          Generated: {new Date(cert.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                        cert.emailStatus === 'sent' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : cert.emailStatus === 'failed'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        Email: {cert.emailStatus}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No certificates generated yet.</p>
              )}
            </div>
          </div>

          {/* Donations */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee size={16} className="text-emerald-500" />
                Donations ({donations.length})
              </h4>
            </div>
            <div className="p-5">
              {donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-lg font-bold text-emerald-600">₹{donation.amount}</p>
                        <code className="text-xs text-slate-600">TXN: {donation.transactionId || 'N/A'}</code>
                        {donation.paymentDate && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(donation.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        donation.paymentStatus === 'success' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : donation.paymentStatus === 'failed'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {donation.paymentStatus}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No donations made.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-slate-400 flex-shrink-0" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-24 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-900 font-medium">{value || '-'}</span>
    </div>
  );
}
