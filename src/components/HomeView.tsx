import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  PiggyBank, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Layers,
  HelpCircle,
  AlertCircle,
  PlusCircle,
  XCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { 
  InvestmentPlan, 
  UserPageView, 
  UserProfile, 
  InvestmentRequest, 
  UserActiveInvestment, 
  TransactionRecord 
} from '../types';

interface HomeViewProps {
  user: UserProfile;
  plans: InvestmentPlan[];
  setCurrentPage: (page: UserPageView) => void;
  onSelectPlan: (plan: InvestmentPlan) => void;
  onOpenDeposit: () => void;
  investmentRequests: InvestmentRequest[];
  activeInvestments: UserActiveInvestment[];
  transactions: TransactionRecord[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  plans,
  setCurrentPage,
  onSelectPlan,
  onOpenDeposit,
  investmentRequests = [],
  activeInvestments = [],
  transactions = []
}) => {
  const pendingRequests = investmentRequests.filter(r => r.status === 'pending');
  const pendingAmount = pendingRequests.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Account Greeting & Status */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Standard Account Active
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-mono">Ref: {user.referral_code}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-blue-600">{user.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Invest in transparent daily yield tiers. All payments submitted to platform owner Adil Soomro are verified manually on EasyPaisa before activation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDeposit}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Invest in Plan</span>
            </button>
            <button
              onClick={() => setCurrentPage('withdraw')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Pending Verification Alert Banner (if user has pending requests) */}
      {pendingRequests.length > 0 && (
        <section className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    {pendingRequests.length} Investment Request{pendingRequests.length > 1 ? 's' : ''} Pending Verification
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono text-[10px] font-bold">
                    PKR {pendingAmount.toLocaleString()} Total
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Your manual payment receipt and Transaction ID have been forwarded to platform owner <strong>Adil Soomro (EasyPaisa: 03127409287)</strong> for review. Your account balance/investment will be credited once confirmed.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('investment-history')}
              className="px-3.5 py-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              View Verification Status
            </button>
          </div>
        </section>
      )}

      {/* 3. Core Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Available Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              PKR {user.balance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ready for immediate withdrawal
            </p>
          </div>
        </div>

        {/* Total Investment */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Investment
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              PKR {user.total_investment.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Active verified capital
            </p>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Earnings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              +PKR {user.today_earning.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Daily yields accrued
            </p>
          </div>
        </div>

        {/* Total Earnings / Withdrawals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              PKR {user.total_earnings.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Withdrawals: PKR {user.total_withdrawals.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Investment Plans Section (Quick Showcase) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Featured Investment Plans
            </h2>
            <p className="text-xs text-slate-500">
              Select a tier, transfer funds via EasyPaisa to owner Adil Soomro, and submit TID for manual approval.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('investment')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.slice(0, 4).map((plan) => (
            <div 
              key={plan.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {plan.badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    +{plan.daily_earning} PKR/day
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{plan.description}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Investment:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      PKR {plan.investment_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Daily Return:</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      PKR {plan.daily_earning}/day
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {plan.status === 'coming_soon' ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Invest Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Two Columns: Investment Requests & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Investment Requests & History */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Investment Requests & History
              </h3>
              <p className="text-xs text-slate-500">
                Status of your manual payment submissions
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('investment-history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              See all
            </button>
          </div>

          {investmentRequests.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No investment requests yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select a plan above to send manual payment to EasyPaisa 03127409287.
              </p>
              <button
                onClick={onOpenDeposit}
                className="mt-3 px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Plan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {investmentRequests.slice(0, 4).map((req) => (
                <div 
                  key={req.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.plan_name}</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        PKR {req.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>TID: <span className="font-mono font-medium text-slate-700">{req.transaction_id}</span></span>
                      <span>•</span>
                      <span>{req.created_at.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {req.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Pending Verification
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transaction History */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Transaction History
              </h3>
              <p className="text-xs text-slate-500">
                Recent balance ledger and investment events
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Ledger</span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No transactions recorded</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New transactions will record whenever you request an investment or withdrawal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => (
                <div 
                  key={tx.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 truncate max-w-[220px]">
                      {tx.description}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="font-mono">{tx.reference}</span>
                      <span>•</span>
                      <span>{tx.created_at}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-slate-900 block">
                      PKR {tx.amount.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'completed' ? 'text-emerald-600' :
                      tx.status === 'pending' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
