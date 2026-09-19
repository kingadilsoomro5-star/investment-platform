import React from 'react';
import { Home, Layers, ArrowUpRight, User, ShieldCheck } from 'lucide-react';
import { PageView, UserProfile } from '../types';

interface MobileNavProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  isLoggedIn: boolean;
  user?: UserProfile | null;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  user
}) => {
  if (!isLoggedIn) {
    return null;
  }

  // Exactly four options as requested: Home, Investment, Withdraw, Profile
  const navItems = [
    { id: 'home' as PageView, label: 'Home', icon: Home },
    { id: 'investment' as PageView, label: 'Plans', icon: Layers },
    { id: 'withdraw' as PageView, label: 'Withdraw', icon: ArrowUpRight },
    { id: 'profile' as PageView, label: 'Profile', icon: User },
  ];

  return (
    <div 
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden pb-safe shadow-lg shadow-slate-900/5"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              id={`mobile-nav-btn-${item.id}`}
              onClick={() => setCurrentPage(item.id)}
              className="flex flex-col items-center justify-center relative py-1 transition-all group cursor-pointer"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-slate-900 rounded-b-full shadow-sm"></span>
              )}
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[11px] tracking-tight font-semibold ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
