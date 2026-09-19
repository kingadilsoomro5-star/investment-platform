import React from 'react';
import { TrendingUp, ShieldAlert, Lock, Headphones, RefreshCw } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-100">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Encrypted Capital Flow</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                256-bit TLS bank-grade security protocols across all wallet integrations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Transparent Payouts</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Direct mobile wallet settlement via JazzCash, EasyPaisa, & Raast Instant Pay.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">24/7 Member Desk</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Dedicated support assistance for transactions, account security, and inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Advisory Card */}
        <div className="my-8 p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900/90 leading-relaxed">
            <strong className="font-bold text-amber-950 block mb-1">
              Important Investment Risk Notice & Compliance Disclosure
            </strong>
            Investment returns and daily earning allocations are subject to market conditions, liquidity cycles, and operational performance. All capital investments carry inherent financial risks. InvestPro does not guarantee fixed capital recovery or risk-free results. Users are strongly advised to assess their risk capacity and review all terms & conditions prior to activating any plan.
          </div>
        </div>

        {/* Links & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Invest<span className="text-blue-600">Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Next-generation peer earning and transparent asset growth portal engineered for modern individual capital allocation.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Quick Navigation</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 transition-colors">
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('investment')} className="hover:text-blue-600 transition-colors">
                  Investment Tiers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('withdraw')} className="hover:text-blue-600 transition-colors">
                  Fund Withdrawal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className="hover:text-blue-600 transition-colors">
                  Member Profile
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Security & Gateway</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                JazzCash Gateway (Instant)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                EasyPaisa Integration
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Raast Inter-Bank Link
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Two-Factor Account Guard
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Support Desk</h5>
            <p className="text-xs text-slate-500 mb-2">
              Assistance is available 7 days a week:
            </p>
            <p className="text-xs font-semibold text-slate-800">support@investpro.pk</p>
            <p className="text-xs text-slate-500 mt-1">UAN: +92 (21) 111-468-378</p>
            <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block font-semibold">
              ● System Status: Operational
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 InvestPro Financial Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Risk Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
