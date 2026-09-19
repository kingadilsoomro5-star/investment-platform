import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Wallet, 
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Info
} from 'lucide-react';
import { InvestmentPlan, UserProfile } from '../types';
import { OFFICIAL_DEPOSIT_ACCOUNT } from '../data/mockData';

interface InvestmentModalProps {
  plan: InvestmentPlan | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: InvestmentPlan) => void;
  onOpenDeposit: () => void;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  plan,
  user,
  isOpen,
  onClose,
  onConfirm,
  onOpenDeposit
}) => {
  if (!isOpen || !plan) return null;

  const [agreedToRisk, setAgreedToRisk] = useState(true);
  const invAmount = plan.investment_amount ?? plan.investmentAmount ?? 0;
  const dailyEarn = plan.daily_earning ?? plan.dailyEarning ?? 0;
  const duration = plan.duration_days ?? plan.durationDays ?? 30;

  const isSufficient = user.balance >= invAmount;
  const projectedTotalEarnings = dailyEarn * duration;
  const balanceAfter = user.balance - invAmount;

  const handleConfirm = () => {
    if (!isSufficient || !agreedToRisk) return;
    onConfirm(plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        id="investment-confirmation-modal"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Plan Allocation</h3>
              <p className="text-xs text-slate-500">Tier: {plan.name}</p>
            </div>
          </div>
          <button 
            id="close-invest-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Key Metrics Summary Card */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Required Capital
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                PKR {invAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                Daily Earning
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                +PKR {dailyEarn} <span className="text-xs font-normal text-slate-500">/day</span>
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Cycle Duration: <strong className="text-slate-800">{duration} Days</strong>
              </span>
              <span className="text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Est. Total Return: <strong className="text-emerald-700">PKR {projectedTotalEarnings.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Account Balance Verification */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-slate-400" />
                Your Available Balance
              </span>
              <span className="font-bold text-slate-900">
                PKR {user.balance.toLocaleString()}
              </span>
            </div>

            {isSufficient ? (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">Balance After Allocation</span>
                <span className="font-bold text-slate-700">
                  PKR {balanceAfter.toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Balance is PKR {user.balance} (Requires PKR {invAmount})</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    EasyPaisa Direct
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-amber-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Official EasyPaisa Account</span>
                    <span className="font-mono font-black text-slate-900 text-sm">{OFFICIAL_DEPOSIT_ACCOUNT.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDeposit();
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shrink-0 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Deposit via EasyPaisa</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Compliance & Risk Acknowledgment */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Yield Policy Notice:</strong> Daily earnings are calculated automatically and distributed to your wallet at 00:00 PKT. Plan capital remains locked during the 30-day term. Returns can involve risk; please review your financial objectives.
            </div>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input 
              type="checkbox"
              id="confirm-risk-acknowledgment"
              checked={agreedToRisk}
              onChange={(e) => setAgreedToRisk(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-600">
              I authorize the immediate deduction of <strong>PKR {invAmount}</strong> from my available balance to activate the <strong>{plan.name}</strong> plan.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            id="cancel-invest-modal-btn"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="execute-confirm-investment-btn"
            disabled={!isSufficient || !agreedToRisk}
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Activate Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
