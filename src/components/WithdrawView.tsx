import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Smartphone, 
  CreditCard,
  Building2,
  Info,
  ArrowRight
} from 'lucide-react';
import { UserProfile, WithdrawalRecord } from '../types';
import { api } from '../lib/api';

interface WithdrawViewProps {
  user: UserProfile;
  withdrawals: WithdrawalRecord[];
  onWithdrawalSubmitted: (withdrawal: WithdrawalRecord, updatedUser: UserProfile) => void;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  user,
  withdrawals = [],
  onWithdrawalSubmitted
}) => {
  const MIN_WITHDRAWAL = 50;

  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('EasyPaisa');
  const [accountNumber, setAccountNumber] = useState<string>(user.phone);
  const [accountTitle, setAccountTitle] = useState<string>(user.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const methods = [
    { id: 'EasyPaisa', name: 'EasyPaisa', icon: Smartphone, label: '03XX XXXXXXX' },
    { id: 'JazzCash', name: 'JazzCash', icon: Smartphone, label: '03XX XXXXXXX' },
    { id: 'Raast', name: 'Raast P2P', icon: CreditCard, label: 'Mobile / IBAN' },
    { id: 'Bank Transfer', name: 'Bank Transfer', icon: Building2, label: 'Account / IBAN' },
  ];

  const handleQuickPercent = (pct: number) => {
    const val = Math.floor((user.balance * pct) / 100);
    setAmount(val > 0 ? val.toString() : '');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount');
      return;
    }

    if (numericAmount < MIN_WITHDRAWAL) {
      setErrorMsg(`Minimum withdrawal limit is PKR ${MIN_WITHDRAWAL}`);
      return;
    }

    if (numericAmount > user.balance) {
      setErrorMsg(`Insufficient funds. Your available balance is PKR ${user.balance.toLocaleString()}`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMsg('Please provide your wallet or account number');
      return;
    }

    if (!accountTitle.trim()) {
      setErrorMsg('Please enter the exact title / registered name on this account');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitWithdrawal({
        amount: numericAmount,
        payment_method: paymentMethod,
        account_number: accountNumber.trim(),
        account_title: accountTitle.trim()
      });

      setSuccessMsg(`Withdrawal request for PKR ${numericAmount} submitted. Status: Pending Owner Review.`);
      setAmount('');
      onWithdrawalSubmitted(res.withdrawal, res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Withdrawal submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Payout Gateway
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500">Manual Owner Settlement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Withdraw Funds & Capital
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Withdraw accrued earnings directly to your mobile wallet or bank. All withdrawal requests are reviewed and settled by the platform compliance owner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Balance Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Available Withdrawable Balance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                PKR {user.balance.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Withdrawal Amount (PKR) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Min: PKR {MIN_WITHDRAWAL}</span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400 font-mono">
                  PKR
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (e.g. 100)"
                  min={MIN_WITHDRAWAL}
                  max={user.balance}
                  className="w-full pl-14 pr-4 py-2.5 text-base sm:text-lg bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono font-bold"
                  required
                />
              </div>

              {/* Quick Percent Buttons */}
              <div className="flex gap-2 mt-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    {pct === 100 ? 'Max (100%)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Destination Wallet / Method <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {methods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs' 
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                      <div className="text-xs font-bold leading-tight">{m.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account / Wallet Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 03123456789"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Title (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Submitting a withdrawal request deducts the requested funds from your available balance immediately and queues it for owner settlement. If rejected, the full amount is instantly refunded.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || user.balance < MIN_WITHDRAWAL}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Submit Withdrawal Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 1 Col: Guidelines & Security */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Withdrawal Guidelines</h3>
            
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                <span>Minimum withdrawal threshold is <strong>PKR 50</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                <span>Owner manually transfers funds directly to your specified EasyPaisa or JazzCash account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                <span>Ensure your registered wallet account title exactly matches your bank/wallet records.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[10px]">4</span>
                <span>Standard verification and payout turnaround is typically within 1 to 24 hours.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Withdrawal History</h3>
            <p className="text-xs text-slate-500">Record of payout requests and settlement status</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total: {withdrawals.length}</span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-8 text-center space-y-1">
            <p className="text-xs font-bold text-slate-700">No withdrawals requested yet</p>
            <p className="text-[11px] text-slate-400">Your requested payouts will be archived here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {withdrawals.map((w) => (
              <div key={w.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{w.payment_method}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-slate-600">{w.account_number}</span>
                    <span className="text-slate-400">({w.account_title})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Ref: <span className="font-mono">{w.reference_id}</span></span>
                    <span>•</span>
                    <span>{w.created_at}</span>
                  </div>
                  {w.admin_note && (
                    <p className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded inline-block">
                      <strong>Admin:</strong> {w.admin_note}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-sm font-black font-mono text-slate-900">
                    PKR {w.amount.toLocaleString()}
                  </span>

                  {w.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-pulse" />
                      Pending
                    </span>
                  )}
                  {w.status === 'approved' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  )}
                  {w.status === 'rejected' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
