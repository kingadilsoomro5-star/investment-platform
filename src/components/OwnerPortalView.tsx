import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone, 
  Image as ImageIcon, 
  Eye, 
  Search, 
  Filter, 
  ArrowLeft,
  DollarSign, 
  UserCheck, 
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';
import { DepositRequest, UserProfile } from '../types';
import { OFFICIAL_DEPOSIT_ACCOUNT } from '../data/mockData';

interface OwnerPortalViewProps {
  depositRequests: DepositRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason?: string) => void;
  onBackToUser: () => void;
  currentUser: UserProfile;
}

export const OwnerPortalView: React.FC<OwnerPortalViewProps> = ({
  depositRequests,
  onApprove,
  onReject,
  onBackToUser,
  currentUser
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Payment not received on EasyPaisa 03127409287');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pendingCount = depositRequests.filter(r => r.status === 'pending').length;
  const approvedCount = depositRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = depositRequests.filter(r => r.status === 'rejected').length;
  const totalVolume = depositRequests
    .filter(r => r.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredRequests = depositRequests.filter((req) => {
    if (activeFilter !== 'all' && req.status !== activeFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const uName = req.userName || req.user_name || '';
    const uPhone = req.userPhone || req.user_phone || '';
    const sPhone = req.senderPhone || '';
    const tId = req.trxId || req.transaction_id || '';
    const pName = req.planName || req.plan_name || '';
    return (
      uName.toLowerCase().includes(q) ||
      uPhone.toLowerCase().includes(q) ||
      sPhone.toLowerCase().includes(q) ||
      tId.toLowerCase().includes(q) ||
      pName.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmReject = (id: string) => {
    onReject(id, rejectReason);
    setRejectingId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                  Owner Admin Mode
                </span>
                <span className="text-xs text-slate-400">
                  EasyPaisa: <strong className="text-white font-mono">{OFFICIAL_DEPOSIT_ACCOUNT.accountNumber}</strong>
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                Deposit & Investment Approvals Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Review incoming EasyPaisa payments, verify payment screenshots (SS), and approve balance to user accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToUser}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App Dashboard</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
            <span className="text-[10px] text-slate-400">Awaiting your approval</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Approved Deposits</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-1">{approvedCount}</p>
            <span className="text-[10px] text-slate-400">Credited to users</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Rejected</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400 mt-1">{rejectedCount}</p>
            <span className="text-[10px] text-slate-400">Invalid or fake proof</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Approved PKR</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">PKR {totalVolume.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">Total volume verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Requests ({depositRequests.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, TRX ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No requests found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No deposit or investment requests matching your current filter. When a user submits an EasyPaisa payment screenshot, it will appear here.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                req.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/40'
                  : req.status === 'approved'
                  ? 'border-slate-200'
                  : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* User & Request Info */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {(req.userName || req.user_name || 'U').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{req.userName || req.user_name || 'InvestPro User'}</h3>
                      <span className="text-xs text-slate-500">({req.userPhone || req.user_phone || 'N/A'})</span>
                      <span className="text-xs text-slate-400">• {req.userEmail || req.user_email || ''}</span>
                      
                      {/* Status Badge */}
                      {req.status === 'pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Owner Approval
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Approved & Credited
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      )}
                    </div>

                    {/* Plan details and payment meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      <div>
                        Target: <strong className="text-slate-900">{req.planName || req.plan_name || 'Direct Wallet Deposit'}</strong>
                      </div>
                      <div>
                        Sender Number: <strong className="font-mono text-slate-900">{req.senderPhone || req.user_phone || 'N/A'}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        TRX ID: <strong className="font-mono text-slate-900">{req.trxId || req.transaction_id || 'N/A'}</strong>
                        <button
                          onClick={() => handleCopy(req.trxId || req.transaction_id || '', req.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Copy TRX ID"
                        >
                          {copiedId === req.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-slate-400">
                        Submitted: {req.submittedAt || req.created_at || 'Recently'}
                      </div>
                    </div>

                    {req.rejectionReason && (
                      <p className="text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 mt-1 inline-block">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:self-center shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                  {/* Amount Pill */}
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested Amount</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      PKR {req.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Screenshot Preview Button */}
                  {(req.screenshotUrl || req.screenshot) && (
                    <button
                      onClick={() => setSelectedScreenshot(req.screenshotUrl || req.screenshot || null)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View uploaded EasyPaisa Screenshot"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-600" />
                      <span>View SS</span>
                    </button>
                  )}

                  {/* Action Buttons for Pending */}
                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onApprove(req.id)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Add Balance</span>
                      </button>

                      <button
                        onClick={() => setRejectingId(req.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reject confirmation dropdown if open */}
              {rejectingId === req.id && (
                <div className="mt-4 pt-3 border-t border-rose-200/80 p-3 rounded-xl bg-rose-50/80 space-y-2">
                  <span className="text-xs font-bold text-rose-900 block">
                    Confirm Rejection for {req.userName}:
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (e.g. TRX not found in EasyPaisa)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-rose-300 text-slate-800"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmReject(req.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold">EasyPaisa Payment Screenshot (SS) Proof</span>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-auto">
              <img
                src={selectedScreenshot}
                alt="EasyPaisa Payment Screenshot"
                className="max-h-[60vh] max-w-full rounded-lg shadow-md object-contain border border-slate-300 bg-white"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Verify date, time, EasyPaisa number <strong>03127409287</strong>, and 3737 TID.
              </p>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
