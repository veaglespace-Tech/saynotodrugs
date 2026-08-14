'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { LayoutDashboard, Users, IndianRupee, UserCog, LogOut, Menu, Sliders } from 'lucide-react';
import { logout } from '../../redux/slice/appSlice';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.app.token);
  const adminUser = useSelector((state) => state.app.adminUser);

  const isLoginPage = pathname === '/admin/login';

  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    return <div className="h-screen overflow-hidden bg-[#FAFAFA] flex"></div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!token) return <div className="h-screen overflow-hidden bg-[#FAFAFA] flex"></div>; // Wait for redirect

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users & Pledges', href: '/admin/users', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: IndianRupee },
    { name: 'Site Config', href: '/admin/config', icon: Sliders },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAFA] flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#1a1a1a]/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-72 bg-white border-r border-gray-200 text-[#4a4a4a] transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Tricolor top accent */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="h-24 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-[#1a1a1a]">
            <img src="/logo.webp" alt="Veagle Space Logo" className="h-16 w-auto object-contain animate-coin-flip" />
            <span className="text-xl font-bold tracking-tight">Say No to Drugs</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto space-y-2">
          <div className="px-4 mb-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-[#FF9933] text-white shadow-lg shadow-[#FF9933]/20' 
                  : 'hover:bg-[#FFF9F2] hover:text-[#1a1a1a]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-[#6b7280]'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-[#FFF9F2] rounded-xl mb-4 border border-[#FF9933]/10 hover:bg-[#FF9933]/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center text-white font-bold shadow-inner">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a1a] truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-[#6b7280] truncate">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-[#4a4a4a]">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 relative">
          {/* Tricolor accent */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          <div className="flex items-center gap-2 text-[#1a1a1a]">
            <img src="/logo.webp" alt="Veagle Space Logo" className="h-14 w-auto object-contain animate-coin-flip" />
            <span className="font-bold tracking-tight">Say No to Drugs</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors p-2"
          >
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
