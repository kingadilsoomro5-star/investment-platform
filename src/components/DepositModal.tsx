import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Smartphone,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Clock,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_DEPOSIT_ACCOUNT } from '../data/mockData';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDepositRequest: (requestData: {
    amount: number;
    senderPhone: string;
    trxId: string;
    screenshotUrl?: string;
    planId?: string;
    planName?: string;
  }) => void;
  initialAmount?: number;
  targetPlanId?: string;
  targetPlanName?: string;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSubmitDepositRequest,
  initialAmount,
  targetPlanId,
  targetPlanName
}) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState<number>(initialAmount || 300);
  const [senderAccount, setSenderAccount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialAmount && initialAmount > 0) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  const presets = [200, 300, 400, 500, 1000];

  const handleCopy = () => {
    navigator.clipboard?.writeText(OFFICIAL_DEPOSIT_ACCOUNT.accountNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleScreenshot = () => {
    setScreenshotUrl('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600');
    setScreenshotFileName('easypaisa_3737_payment_slip.jpg');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 50) {
      setErrorMsg('Minimum deposit amount is PKR 50');
      return;
    }
    if (!senderAccount.trim() || senderAccount.trim().length < 10) {
      setErrorMsg('Please enter your sender EasyPaisa number (at least 10-11 digits)');
      return;
    }
    if (!screenshotUrl) {
      setErrorMsg('Please upload payment screenshot (SS) or select sample slip to verify');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSubmittedSuccess(true);
      
      onSubmitDepositRequest({
        amount,
        senderPhone: senderAccount.trim(),
        trxId: trxId.trim() || `EP-${Math.floor(100000 + Math.random() * 900000)}`,
        screenshotUrl,
        planId: targetPlanId,
        planName: targetPlanName
      });

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        id="easypaisa-deposit-modal"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">EasyPaisa Deposit & Screenshot Proof</h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Owner Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Official EasyPaisa Account: 03127409287</p>
            </div>
          </div>
          <button 
            id="close-deposit-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {submittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900">Payment Screenshot Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your deposit proof of <strong>PKR {amount.toLocaleString()}</strong> has been sent directly to the owner (<strong>Adil Soomro</strong>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 max-w-xs mx-auto text-left">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>As soon as the owner confirms your payment on EasyPaisa, balance will be added to your account!</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDeposit} className="space-y-4">
              {targetPlanName && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <span>Target Plan: <strong>{targetPlanName}</strong></span>
                  <span className="font-bold text-blue-700">PKR {amount}</span>
                </div>
              )}

              {/* Official EasyPaisa Deposit Box */}
              <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-300/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Owner's Official EasyPaisa Account
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                      EasyPaisa Mobile Number
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-wider">
                      {OFFICIAL_DEPOSIT_ACCOUNT.accountNumber}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      Account Title: Adil Soomro (Owner)
                    </span>
                  </div>

                  <button
                    type="button"
                    id="copy-easypaisa-number-btn"
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedNumber ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Apne EasyPaisa app ya <strong>*786#</strong> se is number <strong>{OFFICIAL_DEPOSIT_ACCOUNT.accountNumber}</strong> par paise bhein aur slip ka Screenshot (SS) niche upload karein.
                </p>
              </div>

              {/* Quick Select Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Investment / Deposit Amount (PKR)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        amount === val
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      PKR {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <input
                  type="number"
                  min="50"
                  max="100000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount (min 50)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>

              {/* Sender Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your EasyPaisa Sender Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={senderAccount}
                  onChange={(e) => setSenderAccount(e.target.value)}
                  placeholder="e.g. 0312 1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  required
                />
              </div>

              {/* Transaction ID / 3737 Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    EasyPaisa 3737 TID / TRX ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">From EasyPaisa SMS</span>
                </div>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="e.g. 37371982341"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 uppercase"
                />
              </div>

              {/* Screenshot (SS) Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    Payment Screenshot (SS) Proof <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSampleScreenshot}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Use Sample Slip
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {screenshotUrl ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-emerald-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={screenshotUrl}
                        alt="Screenshot Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {screenshotFileName || 'Payment_Screenshot.jpg'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">Ready for owner verification</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotUrl('');
                        setScreenshotFileName('');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-emerald-50/30"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-700">
                      Click to upload Payment Screenshot (SS)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      EasyPaisa success screen / SMS receipt
                    </p>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-easypaisa-deposit-btn"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Send Screenshot to Owner & Request Balance</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
