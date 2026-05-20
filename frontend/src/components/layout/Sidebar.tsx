import React from 'react';
import { Users, LayoutDashboard, ShieldCheck, LogOut, ChevronRight, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
  { to: '/leads', icon: <Users className="h-5 w-5" />, label: 'Leads' },
  { to: '/admin/users', icon: <ShieldCheck className="h-5 w-5" />, label: 'User Management', adminOnly: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin());

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 transition-transform duration-300 ease-in-out md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-5 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/10">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-3.5 pt-5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border-l-4 border-indigo-300 scale-[1.02]'
                  : 'text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 hover:scale-[1.01]'
              )
            }
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-slate-200/60 p-4 dark:border-slate-800/80">
        <div className="mb-3.5 flex items-center gap-3 rounded-xl bg-slate-50/80 border border-slate-100 dark:border-slate-800/40 px-3.5 py-3 dark:bg-slate-900/60 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-extrabold text-white shadow-inner">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-white">{user?.name}</p>
            <p className="truncate text-[10px] font-semibold text-slate-400 capitalize dark:text-slate-400">{user?.role}</p>
          </div>
        </div>
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl border border-transparent px-3.5 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-100 dark:hover:border-rose-900/20 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
};
