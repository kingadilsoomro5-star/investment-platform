import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Info,
  Sparkles
} from 'lucide-react';
import { InvestmentPlan, PaymentSettings, InvestmentRequest } from '../types';
import { api } from '../lib/api';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: InvestmentPlan | null;
  paymentSettings: PaymentSettings | null;
  onRequestSubmitted: (request: InvestmentRequest) => void;
  onNavigateToHistory: () => void;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  paymentSettings,
  onRequestSubmitted,
  onNavigateToHistory
}) => {
  if (!isOpen || !selectedPlan) return null;

  const [trxId, setTrxId] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<InvestmentRequest | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const paymentAccount = paymentSettings?.account_number || '03127409287';
  const accountHolder = paymentSettings?.account_holder_name || 'Adil Soomro';
  const paymentMethod = paymentSettings?.payment_method || 'EasyPaisa';
  const instructions = paymentSettings?.payment_instructions || 'Transfer exact amount via EasyPaisa and submit TID + receipt screenshot.';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Screenshot file size exceeds 5MB limit');
        return;
      }
      setScreenshotName(file.name);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper for quick testing demo
  const handleUseSampleReceipt = () => {
    // Generate an authentic looking SVG receipt slip in base64
    const sampleSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="%23f8fafc" rx="16"/>
      <rect x="20" y="20" width="360" height="90" fill="%230f172a" rx="12"/>
      <text x="40" y="55" fill="%2334d399" font-family="sans-serif" font-weight="bold" font-size="20">EasyPaisa</text>
      <text x="40" y="80" fill="%23ffffff" font-family="sans-serif" font-size="14">Money Transfer Successful</text>
      <rect x="20" y="130" width="360" height="340" fill="%23ffffff" rx="12" stroke="%23e2e8f0"/>
      <text x="40" y="170" fill="%2364748b" font-family="sans-serif" font-size="13">Sent To:</text>
      <text x="40" y="195" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="16">${accountHolder}</text>
      <text x="40" y="220" fill="%2364748b" font-family="monospace" font-size="14">${paymentAccount}</text>
      <line x1="40" y1="240" x2="360" y2="240" stroke="%23f1f5f9" stroke-width="2"/>
      <text x="40" y="275" fill="%2364748b" font-family="sans-serif" font-size="13">Amount Transferred:</text>
      <text x="40" y="305" fill="%23059669" font-family="sans-serif" font-weight="bold" font-size="24">PKR ${selectedPlan.investment_amount}.00</text>
      <text x="40" y="350" fill="%2364748b" font-family="sans-serif" font-size="13">Transaction ID (TID):</text>
      <text x="40" y="375" fill="%230f172a" font-family="monospace" font-weight="bold" font-size="15">EP-${Math.floor(1000000000 + Math.random() * 9000000000)}</text>
      <text x="40" y="420" fill="%2394a3b8" font-family="sans-serif" font-size="12">Fee: PKR 0.00 • Timestamp: Just Now</text>
    </svg>`;

    setScreenshot(sampleSvg);
    setScreenshotName('easypaisa_receipt_verified.png');
    if (!trxId) {
      setTrxId(`EP-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!trxId.trim()) {
      setErrorMsg('Please enter the EasyPaisa Transaction ID (TID)');
      return;
    }

    if (!screenshot) {
      setErrorMsg('Please upload or attach the payment transfer screenshot / receipt');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitInvestmentRequest({
        plan_id: selectedPlan.id,
        transaction_id: trxId.trim(),
        screenshot,
        notes: notes.trim() || undefined
      });

      setSubmittedRequest(res.request);
      onRequestSubmitted(res.request);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit investment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        id="manual-payment-modal"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Manual Investment Payment
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                {selectedPlan.name} • PKR {selectedPlan.investment_amount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedRequest ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                Status: Pending Verification
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-3">
                Investment Request Submitted
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                “Your investment request has been submitted and is waiting for verification.”
              </p>
            </div>

            {/* Request Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Plan:</span>
                <span className="font-bold text-slate-900">{submittedRequest.plan_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Sent:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  PKR {submittedRequest.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID (TID):</span>
                <span className="font-bold text-slate-900 font-mono">{submittedRequest.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Projected Daily Earning:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  +PKR {submittedRequest.daily_earning}/day (after verification)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manual Verification:</span>
                <span className="font-semibold text-slate-700">Platform Owner ({accountHolder})</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-left flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Do not transfer funds multiple times for the same transaction ID. Once the platform owner verifies your screenshot and payment on EasyPaisa, your plan will be activated and appear in your active portfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToHistory();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                View in Investment History
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form & Instructions Screen */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Manual Verification Warning Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-relaxed">
                <strong>Manual Payment Verification Process:</strong> Send the exact payment to the owner's official EasyPaisa account below. Submitting this form does <strong>NOT</strong> automatically credit your account. The platform owner manually reviews your receipt and approves it.
              </div>
            </div>

            {/* Official EasyPaisa Account Details */}
            <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {paymentMethod} Official Payout / Deposit
                </span>
                <span className="text-xs text-slate-400">Owner Account</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Account Title / Holder</span>
                  <p className="text-base font-bold text-white tracking-tight">{accountHolder}</p>
                  
                  <span className="text-[11px] text-slate-400 block mt-2">{paymentMethod} Number</span>
                  <p className="text-lg sm:text-xl font-mono font-black text-emerald-400 tracking-wider">
                    {paymentAccount}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 shadow-sm"
                  title="Copy account number"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-300" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Exact Transfer Amount:</span>
                <span className="text-sm font-black text-white font-mono">
                  PKR {selectedPlan.investment_amount.toLocaleString()}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  EasyPaisa Transaction ID (TID) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 37372948291 or EP-992182"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono uppercase"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter the exact 11-digit or reference ID generated by EasyPaisa after sending funds.
                </p>
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Payment Screenshot / Receipt <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSampleReceipt}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Attach Sample Slip (Demo)
                  </button>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    screenshot 
                      ? 'border-emerald-400 bg-emerald-50/40' 
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {screenshot ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={screenshot} 
                          alt="Screenshot preview" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                            {screenshotName || 'Payment_Slip.png'}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Image attached ready for upload
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold hover:underline">
                        Change
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-medium text-slate-700">
                        Click to browse or drag & drop payment screenshot
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, or JPEG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sender Phone / Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sent from 0300-XXXXXXX"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Submit Investment Request (PKR {selectedPlan.investment_amount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                Owner will review transaction on EasyPaisa 03127409287 before crediting your account.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
