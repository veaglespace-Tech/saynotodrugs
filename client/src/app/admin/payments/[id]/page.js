'use client';
import { useGetAdminPledgesQuery } from '../../../../redux/api/apiSlice';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, IndianRupee, CreditCard, Calendar, FileText, Hash, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetAdminPledgesQuery();

  const pledges = data?.success ? data.pledges : [];
  
  // Find the specific donation
  let donation = null;
  for (const pledge of pledges) {
    const found = pledge.donations?.find(d => d.id === parseInt(id));
    if (found) {
      donation = {
        ...found,
        user: pledge.user,
        pledgeId: pledge.id,
        campaign: pledge.campaign
      };
      break;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Payment Not Found</h2>
        <p className="text-slate-600">The requested payment details could not be found.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium">Go Back</button>
      </div>
    );
  }

  const user = donation.user;

  const statusColors = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Payment Successful', grad: 'from-emerald-500 to-teal-500' },
    failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Payment Failed', grad: 'from-red-500 to-rose-500' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Payment Pending', grad: 'from-amber-400 to-orange-500' }
  };

  const status = statusColors[donation.paymentStatus] || statusColors.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Details</h1>
          <p className="text-slate-600 mt-1">Detailed view of transaction and donor information.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${status.grad} px-8 py-10 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <StatusIcon size={120} />
          </div>
          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md mb-6 border border-white/30`}>
              <StatusIcon size={18} />
              {status.label}
            </div>
            <p className="text-emerald-50 font-medium mb-1">Total Amount</p>
            <div className="text-6xl font-black tracking-tight">₹{donation.amount}</div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Donor Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Donor Information</h3>
            </div>
            <div className="space-y-5">
              <DetailRow icon={User} label="Full Name" value={user?.name} />
              <DetailRow icon={Mail} label="Email Address" value={user?.email} />
              <DetailRow icon={Phone} label="Mobile Number" value={user?.mobile} />
            </div>
          </div>

          {/* Transaction Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <CreditCard className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Transaction Details</h3>
            </div>
            <div className="space-y-5">
              <DetailRow icon={Hash} label="Transaction ID" value={donation.transactionId || 'N/A'} mono />
              <DetailRow icon={CreditCard} label="Payment Gateway" value={(donation.paymentGateway || 'payu').toUpperCase()} />
              <DetailRow icon={Calendar} label="Date & Time" value={donation.paymentDate ? new Date(donation.paymentDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'} />
            </div>
          </div>

          {/* Pledge Reference */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Pledge Reference</h3>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Campaign</p>
                <p className="text-lg font-bold text-slate-900">{donation.campaign?.name || '-'}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-slate-200"></div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Pledge ID</p>
                <code className="text-base font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-700">#{donation.pledgeId}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400 shrink-0 mt-0.5">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-slate-900 font-medium ${mono ? 'font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-sm' : ''}`}>{value || '-'}</p>
      </div>
    </div>
  );
}
