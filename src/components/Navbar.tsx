import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  PlusCircle,
  FileText,
  Lock
} from 'lucide-react';
import { PageView, UserProfile } from '../types';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  user: UserProfile | null;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenDeposit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  user,
  isLoggedIn,
  onLogout,
  onOpenDeposit
}) => {
  const navItems: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'investment', label: 'Investment Plans' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Disclaimer / Demo Notice Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
            Demo Prototype
          </span>
          <span className="truncate text-slate-300">
            Educational investment management simulation. Manual payment verification process by platform owner.
          </span>
          {user?.role === 'admin' && (
            <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              Owner Account Active
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 font-display">
                  InvestPro
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Fintech
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Yield & Portfolio Management</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Owner Portal Quick Tab for Admins */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('owner-portal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-2 ${
                    currentPage === 'owner-portal'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Owner Portal</span>
                </button>
              )}
            </nav>
          )}

          {/* User Balance & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && user ? (
              <>
                {/* Available Balance Badge with Invest button */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-semibold block leading-none">
                        Balance
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                        PKR {user.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onOpenDeposit}
                    className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 px-2 transition-all cursor-pointer shadow-xs"
                    title="Invest in Plan / Manual Payment Request"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Invest</span>
                  </button>
                </div>

                {/* User Dropdown / Profile Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className={`p-1.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      currentPage === 'profile'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Open Profile"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 hidden lg:inline max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    currentPage === 'login'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
