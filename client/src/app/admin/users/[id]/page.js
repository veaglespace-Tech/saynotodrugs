'use client';
import { useGetAdminPledgesQuery } from '../../../../redux/api/apiSlice';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, FileText, IndianRupee, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetAdminPledgesQuery();

  const pledges = data?.success ? data.pledges : [];
  const pledge = pledges.find(p => p.id === parseInt(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!pledge) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">User Not Found</h2>
        <p className="text-slate-600">The requested user details could not be found.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-orange-600 text-white rounded-xl font-medium">Go Back</button>
      </div>
    );
  }

  const user = pledge.user;
  const donations = pledge.donations || [];
  const certificates = pledge.certificates || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Details</h1>
          <p className="text-slate-600 mt-1">Detailed view of user profile and engagement.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100 shadow-sm">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-slate-600 capitalize text-lg">{user?.profession || 'Not specified'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow icon={Mail} label="Email" value={user?.email} />
            <DetailRow icon={Phone} label="Mobile" value={user?.mobile} />
            <DetailRow icon={Briefcase} label="Profession" value={user?.profession || '-'} />
            <DetailRow icon={MapPin} label="Location" value={`${user?.city || '-'}, ${user?.state || '-'}`} />
            <DetailRow icon={Calendar} label="Registered" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'} />
          </div>
        </div>

        {/* Pledge Info */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <FileText size={20} className="text-orange-500" />
              Pledge Information
            </h4>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow icon={Calendar} label="Pledge Date" value={new Date(pledge.pledgeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            <DetailRow icon={FileText} label="Language" value={pledge.language ? pledge.language.charAt(0).toUpperCase() + pledge.language.slice(1) : '-'} />
            <DetailRow icon={FileText} label="Campaign" value={pledge.campaign?.name || '-'} />
            {pledge.pledgeText && (
              <div className="md:col-span-2 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pledge Text</p>
                <p className="text-slate-700 bg-slate-50 rounded-2xl p-6 border border-slate-200 leading-relaxed text-lg italic">"{pledge.pledgeText}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <CheckCircle2 size={20} className="text-emerald-500" />
              Certificates ({certificates.length})
            </h4>
          </div>
          <div className="p-8">
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex flex-col p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200 mb-3 w-fit">{cert.certificateNumber}</code>
                    <p className="text-sm text-slate-600 mb-4">
                      Generated: {new Date(cert.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
                      cert.emailStatus === 'sent' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : cert.emailStatus === 'failed'
                        ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      Email Status: {cert.emailStatus}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 py-4">No certificates generated yet.</p>
            )}
          </div>
        </div>

        {/* Donations */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <IndianRupee size={20} className="text-emerald-500" />
              Donations ({donations.length})
            </h4>
          </div>
          <div className="p-8">
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 gap-4">
                    <div>
                      <p className="text-2xl font-black text-emerald-600 mb-1">₹{donation.amount}</p>
                      <code className="text-sm text-slate-600">TXN: {donation.transactionId || 'N/A'}</code>
                      {donation.paymentDate && (
                        <p className="text-sm text-slate-500 mt-2">
                          {new Date(donation.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    <div className={`text-sm font-bold px-4 py-2 rounded-full w-fit ${
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
              <p className="text-slate-500 py-4">No donations made.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 text-slate-400">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-slate-900 font-medium">{value || '-'}</p>
      </div>
    </div>
  );
}
