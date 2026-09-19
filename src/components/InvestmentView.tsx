import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Calculator,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  InvestmentPlan, 
  UserProfile, 
  InvestmentRequest, 
  UserActiveInvestment 
} from '../types';

interface InvestmentViewProps {
  plans: InvestmentPlan[];
  user: UserProfile;
  activeInvestments: UserActiveInvestment[];
  investmentRequests: InvestmentRequest[];
  onSelectPlan: (plan: InvestmentPlan) => void;
  defaultTab?: 'plans' | 'active' | 'history';
}

export const InvestmentView: React.FC<InvestmentViewProps> = ({
  plans,
  user,
  activeInvestments = [],
  investmentRequests = [],
  onSelectPlan,
  defaultTab = 'plans'
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'active' | 'history'>(defaultTab);
  const [calcPlanId, setCalcPlanId] = useState<string>(plans[0]?.id || 'plan-1');
  const [calcDays, setCalcDays] = useState<number>(30);

  const selectedCalcPlan = plans.find(p => p.id === calcPlanId) || plans[0];
  const projectedEarnings = selectedCalcPlan ? selectedCalcPlan.daily_earning * calcDays : 0;
  const projectedTotal = selectedCalcPlan ? selectedCalcPlan.investment_amount + projectedEarnings : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-16 md:pb-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Fixed Daily Yields
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">Tiered Micro-Allocations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Investment Plans & Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Choose an investment plan, send the manual payment via EasyPaisa to owner Adil Soomro, and track daily returns.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'plans' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Plans ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'active' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeInvestments.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Requests History ({investmentRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: AVAILABLE PLANS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'plans' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isComingSoon = plan.status === 'coming_soon';
              const isPopular = plan.status === 'popular';

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative group ${
                    isPopular 
                      ? 'border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20' 
                      : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                      Most Popular Tier
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isComingSoon 
                          ? 'bg-slate-100 text-slate-500' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {plan.badge}
                      </span>
                      
                      {!isComingSoon && (
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-600 font-mono">
                            +{plan.daily_earning} PKR
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-none">/ day</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                    {/* Price & Return Box */}
                    <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">Investment Capital:</span>
                        <span className="text-lg font-black text-slate-900 font-mono">
                          {isComingSoon ? 'TBD' : `PKR ${plan.investment_amount.toLocaleString()}`}
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-xs text-slate-500">Daily Return:</span>
                        <span className="text-sm font-bold text-emerald-600 font-mono">
                          {isComingSoon ? 'Coming Soon' : `PKR ${plan.daily_earning}.00`}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-xs text-slate-500">Plan Duration:</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {plan.duration_days} Days
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Manual verification via EasyPaisa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Daily yield crediting after approval</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Direct wallet withdrawal support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 pt-0">
                    {isComingSoon ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Coming Soon</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectPlan(plan)}
                        className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isPopular 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Invest Now (PKR {plan.investment_amount})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Yield Calculator */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Yield Return Calculator</h3>
                <p className="text-xs text-slate-500">Estimate your potential return over custom holding periods</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Investment Tier
                </label>
                <select
                  value={calcPlanId}
                  onChange={(e) => setCalcPlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                >
                  {plans.filter(p => p.status !== 'coming_soon').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — PKR {p.investment_amount} (+PKR {p.daily_earning}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Holding Period: <span className="font-bold text-blue-600">{calcDays} Days</span>
                </label>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="1"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg mt-3"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>7 days</span>
                  <span>30 days</span>
                  <span>60 days</span>
                  <span>90 days</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Projected Total Return</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    PKR {projectedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between pt-2 border-t border-slate-200">
                  <span>Total Yield Gain:</span>
                  <span className="font-bold text-emerald-700 font-mono">+PKR {projectedEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: ACTIVE INVESTMENTS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeInvestments.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Active Investment Plans</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not currently have any active investments. Browse available plans, submit payment via EasyPaisa, and await owner verification.
              </p>
              <button
                onClick={() => setActiveTab('plans')}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Browse Plans
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvestments.map((inv) => (
                <div 
                  key={inv.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        Active Allocation
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{inv.plan_name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      PKR {inv.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Daily Yield</span>
                      <span className="font-bold text-emerald-600 font-mono">+{inv.daily_earning} PKR</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Days Active</span>
                      <span className="font-bold text-slate-800">{inv.days_elapsed} / {inv.duration_days}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Accrued</span>
                      <span className="font-bold text-emerald-600 font-mono">PKR {inv.total_earned}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Term Progress</span>
                      <span>{Math.round((inv.days_elapsed / inv.duration_days) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((inv.days_elapsed / inv.duration_days) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: INVESTMENT REQUESTS HISTORY */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manual Payment Verification Requests</h3>
              <p className="text-xs text-slate-500">
                Audit trail of every submitted payment slip reviewed by owner Adil Soomro
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {investmentRequests.length}</span>
          </div>

          {investmentRequests.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No payment requests submitted yet</p>
              <p className="text-[11px] text-slate-400">
                When you submit a plan payment via EasyPaisa, the verification entry will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {investmentRequests.map((req) => (
                <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{req.plan_name}</h4>
                      <span className="font-mono text-xs font-extrabold text-emerald-600">
                        PKR {req.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>TID: <span className="font-mono font-bold text-slate-800">{req.transaction_id}</span></span>
                      <span>•</span>
                      <span>Submitted: {req.created_at}</span>
                      {req.verified_at && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600">Verified: {req.verified_at}</span>
                        </>
                      )}
                    </div>

                    {req.admin_note && (
                      <p className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg max-w-md mt-1">
                        <strong>Note:</strong> {req.admin_note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {req.status === 'pending' && (
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          Pending Verification
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Awaiting Owner Review
                        </span>
                      </div>
                    )}

                    {req.status === 'approved' && (
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved & Active
                        </span>
                        <span className="text-[10px] text-emerald-700 block mt-1">
                          Plan Activated
                        </span>
                      </div>
                    )}

                    {req.status === 'rejected' && (
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                        <span className="text-[10px] text-rose-600 block mt-1">
                          Not Credited
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
