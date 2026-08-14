'use client';
import { Download, Search, CheckCircle2, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminPledgesQuery } from '../../../redux/api/apiSlice';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const { data, isLoading } = useGetAdminPledgesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'generated', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const pledges = data?.success ? data.pledges : [];

  // Filter & Search Logic
  const filteredPledges = useMemo(() => {
    return pledges.filter(p => {
      const matchesSearch = 
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'generated') {
        matchesStatus = p.certificates && p.certificates.length > 0;
      } else if (statusFilter === 'pending') {
        matchesStatus = !p.certificates || p.certificates.length === 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [pledges, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPledges.length / itemsPerPage);
  const paginatedPledges = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPledges.slice(start, start + itemsPerPage);
  }, [filteredPledges, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Users & Pledges</h1>
          <p className="text-slate-600 mt-1">Manage and export all campaign participants.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF9933] hover:bg-[#E6852E] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#FF9933]/20">
          <Download size={18} />
          <span>Export CSV</span>
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
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#FF9933] focus:border-transparent outline-none transition-all"
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
              className="flex-1 md:w-auto block w-full pl-4 pr-10 py-3 border border-gray-200 bg-white rounded-xl text-[#1a1a1a] focus:ring-2 focus:ring-[#FF9933] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <option value="all">All Users</option>
              <option value="generated">Certificate Generated</option>
              <option value="pending">Certificate Pending</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
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
              {paginatedPledges.map((pledge) => (
                <tr key={pledge.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center font-bold border border-[#FF9933]/20">
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
                    <Link 
                      href={`/admin/users/${pledge.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#FFF9F2] hover:bg-[#FF9933]/10 text-[#FF9933] font-semibold rounded-lg transition-colors border border-[#FF9933]/20"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedPledges.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search and filters.
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
              Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredPledges.length)}</span> of <span className="font-semibold text-slate-900">{filteredPledges.length}</span> results
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
