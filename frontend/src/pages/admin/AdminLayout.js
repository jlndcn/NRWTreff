import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Building2, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Toaster } from '../../components/ui/sonner';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: Users },
  { label: 'Bewerbungen', href: '/admin/bewerbungen', icon: FileText },
  { label: 'Städte', href: '/admin/staedte', icon: Building2 },
];

const NavItems = ({ onClick }) => {
  const location = useLocation();
  return (
    <>
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: location.pathname.startsWith(item.href) ? '#cc000022' : 'transparent',
            color: location.pathname.startsWith(item.href) ? '#ff2244' : '#b7b7b7'
          }}
        >
          <item.icon size={16} />
          {item.label}
        </Link>
      ))}
    </>
  );
};

const AdminLayout = ({ children }) => {
  const { user, logout, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="text-white/40">Lade...</div>
    </div>
  );

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-white/10 sticky top-0 h-screen" style={{ background: '#0d0d0d' }}>
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="text-lg font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            NRW<span style={{ color: '#cc0000' }}>ADMIN</span>
          </Link>
          <div className="text-xs text-white/30 mt-0.5">{user}</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5" data-testid="admin-navigation">
          <NavItems />
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/10" style={{ background: '#0d0d0d' }}>
          <Link to="/" className="text-base font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            NRW<span style={{ color: '#cc0000' }}>ADMIN</span>
          </Link>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white/60 hover:text-white">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-56 border-white/10 p-0" style={{ background: '#0d0d0d' }}>
                <div className="p-4 border-b border-white/10">
                  <div className="text-base font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>NRW<span style={{ color: '#cc0000' }}>ADMIN</span></div>
                </div>
                <nav className="p-3 space-y-0.5">
                  <NavItems />
                </nav>
                <div className="p-3 border-t border-white/10">
                  <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/40">
                    <LogOut size={14} /> Abmelden
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
      <Toaster richColors theme="dark" />
    </div>
  );
};

export default AdminLayout;
