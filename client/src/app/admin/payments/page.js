'use client';
import { Download, Search, CheckCircle2, XCircle, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function PaymentsPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'success', 'failed', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const pledges = data?.success ? data.pledges : [];
  
  // Flatten donations from pledges for the table
  const allDonations = useMemo(() => {
    return pledges.flatMap(p => 
      p.donations.map(d => ({
        ...d,
        user: p.user,
        pledgeId: p.id,
        campaign: p.campaign
      }))
    ).sort((a, b) => new Date(b.paymentDate || b.id) - new Date(a.paymentDate || a.id));
  }, [pledges]);

  // Filter & Search Logic
  const filteredDonations = useMemo(() => {
    return allDonations.filter(d => {
      const matchesSearch = 
        d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || d.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allDonations, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDonations.slice(start, start + itemsPerPage);
  }, [filteredDonations, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#138808]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Donations</h1>
          <p className="text-slate-600 mt-1">Track all contributions made towards the campaign.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#138808] hover:bg-[#0F6B06] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(19,136,8,0.4)]">
          <Download size={18} />
          <span>Export Receipts</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters & Search */}
        <div className="p-6 border-b border-slate-200 bg-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by donor name or TXN ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#138808] focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Filter size={18} />
              <span className="hidden sm:inline">Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:w-auto block w-full pl-4 pr-10 py-3 border border-gray-200 bg-white rounded-xl text-[#1a1a1a] focus:ring-2 focus:ring-[#138808] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
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
              {paginatedDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{donation.user?.name}</div>
                    <div className="text-sm text-slate-600">{donation.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold text-[#138808]">₹{donation.amount}</div>
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
                    <Link 
                      href={`/admin/payments/${donation.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#138808]/5 hover:bg-[#138808]/10 text-[#138808] font-semibold rounded-lg transition-colors border border-[#138808]/20"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedDonations.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No donations found matching your search and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredDonations.length)}</span> of <span className="font-semibold text-slate-900">{filteredDonations.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
