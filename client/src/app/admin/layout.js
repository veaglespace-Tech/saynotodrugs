'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { LayoutDashboard, Users, IndianRupee, Settings, LogOut, Menu, Sliders } from 'lucide-react';
import { logout } from '../../redux/slice/appSlice';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.app.token);
  const adminUser = useSelector((state) => state.app.adminUser);

  const isLoginPage = pathname === '/admin/login';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [token, isLoginPage, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/admin/login');
  };

  if (!mounted) {
    // Avoid hydration mismatch by returning a placeholder or empty div with same structure
    return <div className="h-screen overflow-hidden bg-[#0a0a0a] flex"></div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!token) return <div className="h-screen overflow-hidden bg-[#0a0a0a] flex"></div>; // Wait for redirect

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users & Pledges', href: '/admin/users', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: IndianRupee },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Site Config', href: '/admin/config', icon: Sliders },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] flex selection:bg-rose-500/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#111] border-r border-white/5 text-slate-300">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3 text-white">
            <img src="/logo.png" alt="Veagle Space Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight">Say No to Drugs</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto space-y-2">
          <div className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                  : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4 border border-white/5">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-300">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#111] border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="Veagle Space Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold tracking-tight">Say No to Drugs</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
