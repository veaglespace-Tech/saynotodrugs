'use client';
import { Users, FileText, IndianRupee, TrendingUp } from 'lucide-react';
import { useGetAdminStatsQuery } from '../../redux/api/apiSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: statsData, isLoading } = useGetAdminStatsQuery();
  const stats = statsData?.success ? statsData.stats : null;

  // Mock data for the chart since backend doesn't provide historical data yet
  const chartData = [
    { name: 'Mon', pledges: 4, donations: 1000 },
    { name: 'Tue', pledges: 3, donations: 500 },
    { name: 'Wed', pledges: 7, donations: 2000 },
    { name: 'Thu', pledges: 5, donations: 1500 },
    { name: 'Fri', pledges: 8, donations: 3000 },
    { name: 'Sat', pledges: 12, donations: 5000 },
    { name: 'Sun', pledges: stats?.todayPledges || 2, donations: stats?.todayDonations || 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with the campaign today.</p>
      </div>
      
      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Pledges" 
            value={stats.totalPledges} 
            icon={Users} 
            color="rose" 
            trend="+12%" 
          />
          <KPICard 
            title="Total Donations" 
            value={`₹${stats.totalDonations}`} 
            icon={IndianRupee} 
            color="emerald" 
            trend="+8%" 
          />
          <KPICard 
            title="Certificates Issued" 
            value={stats.certificatesGenerated} 
            icon={FileText} 
            color="purple" 
            trend="+12%" 
          />
          <KPICard 
            title="Today's Pledges" 
            value={stats.todayPledges} 
            icon={TrendingUp} 
            color="amber" 
            trend="+24%" 
          />
        </div>
      )}

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Weekly Engagement</h3>
          <p className="text-slate-600 text-sm">Pledges and donations over the last 7 days.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPledges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', color: '#0f172a' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Area type="monotone" dataKey="pledges" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorPledges)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, trend }) {
  const colorMap = {
    rose: 'bg-orange-500/10 text-orange-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-600 font-medium text-sm">{title}</div>
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
          {trend}
        </div>
      </div>
    </div>
  );
}
