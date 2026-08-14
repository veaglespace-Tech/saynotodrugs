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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Dashboard Overview</h1>
        <p className="text-[#6b7280] mt-1">Welcome back! Here's what's happening with the campaign today.</p>
      </div>
      
      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Pledges" 
            value={stats.totalPledges} 
            icon={Users} 
            color="saffron" 
            trend="+12%" 
          />
          <KPICard 
            title="Total Donations" 
            value={`₹${stats.totalDonations}`} 
            icon={IndianRupee} 
            color="green" 
            trend="+8%" 
          />
          <KPICard 
            title="Certificates Issued" 
            value={stats.certificatesGenerated} 
            icon={FileText} 
            color="navy" 
            trend="+12%" 
          />
          <KPICard 
            title="Today's Pledges" 
            value={stats.todayPledges} 
            icon={TrendingUp} 
            color="gold" 
            trend="+24%" 
          />
        </div>
      )}

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Tricolor top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#1a1a1a]">Weekly Engagement</h3>
          <p className="text-[#6b7280] text-sm">Pledges and donations over the last 7 days.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPledges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF9933" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)', color: '#1a1a1a' }}
                itemStyle={{ color: '#FF9933' }}
              />
              <Area type="monotone" dataKey="pledges" stroke="#FF9933" strokeWidth={3} fillOpacity={1} fill="url(#colorPledges)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, trend }) {
  const colorMap = {
    saffron: { iconBg: 'bg-[#FF9933]/10', iconColor: 'text-[#FF9933]' },
    green: { iconBg: 'bg-[#138808]/10', iconColor: 'text-[#138808]' },
    navy: { iconBg: 'bg-[#000080]/10', iconColor: 'text-[#000080]' },
    gold: { iconBg: 'bg-[#D4A017]/10', iconColor: 'text-[#D4A017]' },
  };

  const c = colorMap[color];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 hover:shadow-md transition-all relative overflow-hidden group">
      {/* Subtle tricolor top accent on hover */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#6b7280] font-medium text-sm">{title}</div>
        <div className={`p-3 rounded-2xl ${c.iconBg} ${c.iconColor}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-bold text-[#1a1a1a]">{value}</div>
        <div className="text-sm font-semibold text-[#138808] bg-[#138808]/8 px-2 py-1 rounded-lg">
          {trend}
        </div>
      </div>
    </div>
  );
}
