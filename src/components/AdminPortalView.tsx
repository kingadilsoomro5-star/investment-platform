import React, { useState, useEffect } from 'react';
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
  Layers,
  Users,
  Settings,
  FileText,
  TrendingUp,
  ArrowUpRight,
  LogOut,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  UserProfile, 
  InvestmentRequest, 
  WithdrawalRecord, 
  InvestmentPlan, 
  PaymentSettings, 
  TransactionRecord, 
  AdminStats,
  AdminPageView 
} from '../types';
import { api } from '../lib/api';

interface AdminPortalViewProps {
  adminUser: UserProfile;
  onLogoutAdmin: () => void;
  onReturnToUserApp: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  adminUser,
  onLogoutAdmin,
  onReturnToUserApp
}) => {
  const [activeTab, setActiveTab] = useState<AdminPageView>('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Modals & Actions
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectRequestReason, setRejectRequestReason] = useState('Payment could not be verified on EasyPaisa 03127409287');
  
  const [rejectingWithdrawalId, setRejectingWithdrawalId] = useState<string | null>(null);
  const [rejectWithdrawalReason, setRejectWithdrawalReason] = useState('Wallet account details mismatch or invalid number');

  // Payment settings form
  const [settingsForm, setSettingsForm] = useState({
    payment_method: 'EasyPaisa',
    account_number: '03127409287',
    account_holder_name: 'Adil Soomro',
    payment_instructions: 'Transfer exact amount via EasyPaisa to Adil Soomro (03127409287) and submit TID.'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search & Filter
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [
        statsData,
        requestsData,
        usersData,
        withdrawalsData,
        plansData,
        paymentSettingsData,
        txData
      ] = await Promise.all([
        api.getAdminStats(),
        api.getAdminInvestmentRequests(),
        api.getAdminUsers(),
        api.getAdminWithdrawals(),
        api.getAdminPlans(),
        api.getAdminPaymentSettings(),
        api.getAdminTransactions()
      ]);

      setStats(statsData);
      setRequests(requestsData);
      setUsers(usersData);
      setWithdrawals(withdrawalsData);
      setPlans(plansData);
      setPaymentSettings(paymentSettingsData);
      setSettingsForm({
        payment_method: paymentSettingsData.payment_method,
        account_number: paymentSettingsData.account_number,
        account_holder_name: paymentSettingsData.account_holder_name,
        payment_instructions: paymentSettingsData.payment_instructions
      });
      setTransactions(txData);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Approve Investment Request
  const handleApproveRequest = async (id: string) => {
    try {
      const res = await api.approveInvestmentRequest(id);
      setActionNotice(res.message);
      fetchAdminData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  // Reject Investment Request
  const handleConfirmRejectRequest = async () => {
    if (!rejectingRequestId) return;
    try {
      const res = await api.rejectInvestmentRequest(rejectingRequestId, rejectRequestReason);
      setActionNotice(res.message);
      setRejectingRequestId(null);
      fetchAdminData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Approve Withdrawal
  const handleApproveWithdrawal = async (id: string) => {
    try {
      const res = await api.approveWithdrawal(id);
      setActionNotice(res.message);
      fetchAdminData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  // Reject Withdrawal
  const handleConfirmRejectWithdrawal = async () => {
    if (!rejectingWithdrawalId) return;
    try {
      const res = await api.rejectWithdrawal(rejectingWithdrawalId, rejectWithdrawalReason);
      setActionNotice(res.message);
      setRejectingWithdrawalId(null);
      fetchAdminData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Save Payment Settings
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateAdminPaymentSettings(settingsForm);
      setPaymentSettings(res.settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update payment settings');
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    if (requestFilter !== 'all' && r.status !== requestFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.user_name.toLowerCase().includes(q) ||
      r.user_email.toLowerCase().includes(q) ||
      r.user_phone.toLowerCase().includes(q) ||
      r.transaction_id.toLowerCase().includes(q) ||
      r.plan_name.toLowerCase().includes(q)
    );
  });

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white font-display">
                  InvestPro Owner Portal
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Owner Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as <strong>{adminUser.name}</strong> ({adminUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onReturnToUserApp}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>User View</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-8 flex gap-1 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: 'Overview Dashboard' },
            { 
              id: 'investment-requests', 
              label: 'Investment Requests', 
              badge: pendingRequestsCount > 0 ? pendingRequestsCount : null 
            },
            { id: 'users', label: 'Registered Users' },
            { 
              id: 'withdrawals', 
              label: 'Withdrawal Requests', 
              badge: pendingWithdrawalsCount > 0 ? pendingWithdrawalsCount : null 
            },
            { id: 'plans', label: 'Investment Plans' },
            { id: 'payment-settings', label: 'Payment Settings' },
            { id: 'transactions', label: 'Audit Transactions' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminPageView)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-black' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-slate-950 text-emerald-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Global Feedback Banner */}
      {actionNotice && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-2.5 text-center text-xs font-bold animate-fadeIn">
          {actionNotice}
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* ---------------------------------------------------- */}
        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Owner Manual Notice */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Owner Manual Verification Protocol</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  As the owner, verify that each incoming deposit has arrived in your official EasyPaisa account (<strong>{paymentSettings?.account_number || '03127409287'}</strong>). Approving a request directly activates the plan and credits user investment metrics. Rejecting keeps user balance uncredited.
                </p>
              </div>
            </div>

            {/* Core Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                <div className="text-3xl font-black text-white font-mono mt-2">
                  {stats?.total_users ?? users.length}
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  +{stats?.new_users ?? 0} registered in last 7 days
                </span>
              </div>

              <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Investments</span>
                <div className="text-3xl font-black text-amber-400 font-mono mt-2">
                  {pendingRequestsCount}
                </div>
                <button
                  onClick={() => setActiveTab('investment-requests')}
                  className="text-[11px] text-blue-400 hover:underline mt-1 block"
                >
                  Requires review & approval →
                </button>
              </div>

              <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Approved Investments</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
                  PKR {(stats?.total_investment_amount ?? 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {stats?.approved_investments ?? 0} active plans approved
                </span>
              </div>

              <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Withdrawals</span>
                <div className="text-3xl font-black text-purple-400 font-mono mt-2">
                  {pendingWithdrawalsCount}
                </div>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className="text-[11px] text-purple-400 hover:underline mt-1 block"
                >
                  Review payout requests →
                </button>
              </div>
            </div>

            {/* Quick Pending Requests Alert */}
            {pendingRequestsCount > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-amber-200">
                    There are {pendingRequestsCount} investment requests awaiting your manual confirmation.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('investment-requests')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Inspect Requests
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 2: INVESTMENT REQUESTS VERIFICATION */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'investment-requests' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-white">Investment Requests Verification</h2>
                <p className="text-xs text-slate-400">
                  Review submitted Transaction IDs and EasyPaisa screenshots before crediting user accounts.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, TID..."
                    className="pl-9 pr-3 py-2 text-xs bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Filter */}
                <div className="flex bg-slate-900 p-1 rounded-xl gap-1">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setRequestFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        requestFilter === filter 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs">
                  No investment requests matching this criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">User Details</th>
                        <th className="py-3 px-4">Selected Plan</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Transaction ID (TID)</th>
                        <th className="py-3 px-4">Payment Screenshot</th>
                        <th className="py-3 px-4">Submitted At</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Owner Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-750 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{req.user_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{req.user_phone}</div>
                            <div className="text-[10px] text-slate-500">{req.user_email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white">{req.plan_name}</span>
                            <span className="text-[10px] text-emerald-400 block font-mono">
                              +{req.daily_earning} PKR/day
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm font-black text-emerald-400 font-mono">
                              PKR {req.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-white bg-slate-900 px-2 py-1 rounded border border-slate-700 inline-flex">
                              <span>{req.transaction_id}</span>
                              <button
                                onClick={() => handleCopy(req.transaction_id, req.id)}
                                className="text-slate-400 hover:text-white"
                                title="Copy TID"
                              >
                                {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {req.screenshot ? (
                              <button
                                onClick={() => setSelectedScreenshot(req.screenshot)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-medium text-[11px] border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Receipt</span>
                              </button>
                            ) : (
                              <span className="text-slate-500">No Slip</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {req.created_at}
                          </td>
                          <td className="py-3.5 px-4">
                            {req.status === 'pending' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending Review
                              </span>
                            )}
                            {req.status === 'approved' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Approved
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApproveRequest(req.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                  title="Verify and credit user plan"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectingRequestId(req.id);
                                    setRejectRequestReason('Payment not found on EasyPaisa 03127409287');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-rose-500/30"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">
                                Processed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 3: REGISTERED USERS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Users Directory</h2>
                <p className="text-xs text-slate-400">All registered member accounts and real-time ledger balances</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Total Users: {users.length}</span>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Available Balance</th>
                      <th className="py-3 px-4">Total Investment</th>
                      <th className="py-3 px-4">Total Earnings</th>
                      <th className="py-3 px-4">Withdrawals</th>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-750">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          PKR {u.balance.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          PKR {u.total_investment.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          PKR {u.total_earnings.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                          PKR {u.total_withdrawals.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-blue-400">
                          {u.referral_code}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {u.created_at.split(' ')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 4: WITHDRAWAL REQUESTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Withdrawal Requests Settlement</h2>
                <p className="text-xs text-slate-400">Review payout requests, approve disbursements, or reject to refund balance</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Total: {withdrawals.length}</span>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              {withdrawals.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs">No withdrawal requests recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Destination Account</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Requested At</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Owner Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-750">
                          <td className="py-3.5 px-4 font-bold text-white">{w.user_name}</td>
                          <td className="py-3.5 px-4">{w.payment_method}</td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-white block">{w.account_number}</span>
                            <span className="text-[10px] text-slate-400">{w.account_title}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                            PKR {w.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                            {w.reference_id}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-slate-400">
                            {w.created_at}
                          </td>
                          <td className="py-3.5 px-4">
                            {w.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Pending
                              </span>
                            )}
                            {w.status === 'approved' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Approved
                              </span>
                            )}
                            {w.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {w.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApproveWithdrawal(w.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectingWithdrawalId(w.id);
                                    setRejectWithdrawalReason('Wallet title mismatch or invalid number');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 5: INVESTMENT PLANS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'plans' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Investment Plans Configuration</h2>
                <p className="text-xs text-slate-400">Configured yield tiers and capital parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300 uppercase">
                      {p.badge}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      p.status === 'coming_soon' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.description}</p>

                  <div className="p-3 bg-slate-900 rounded-xl space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capital:</span>
                      <span className="text-white font-bold">PKR {p.investment_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Return:</span>
                      <span className="text-emerald-400 font-bold">PKR {p.daily_earning}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-slate-300">{p.duration_days} Days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 6: PAYMENT SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'payment-settings' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Owner Official Payment Settings</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure the official EasyPaisa account details displayed to users when submitting manual investments. Stored securely in database.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment settings updated successfully and live across the platform!</span>
                </div>
              )}

              <form onSubmit={handleSavePaymentSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={settingsForm.payment_method}
                    onChange={(e) => setSettingsForm({ ...settingsForm, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Mobile / Account Number (e.g. 03127409287)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.account_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, account_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 rounded-xl border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Holder Name (e.g. Adil Soomro)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.account_holder_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, account_holder_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Instructions Displayed to Users
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.payment_instructions}
                    onChange={(e) => setSettingsForm({ ...settingsForm, payment_instructions: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Payment Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 7: TRANSACTIONS AUDIT LOG */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Full Platform Audit Ledger</h2>
                <p className="text-xs text-slate-400">Complete immutable record of all deposits, approvals, and withdrawals</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Records: {transactions.length}</span>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-750">
                        <td className="py-3.5 px-4 font-bold text-white">{tx.user_name}</td>
                        <td className="py-3.5 px-4 text-slate-200">{tx.description}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{tx.reference}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          PKR {tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                            tx.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-slate-400">{tx.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Screenshot Zoom Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Payment Receipt Proof</h4>
              <button onClick={() => setSelectedScreenshot(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 rounded-xl p-2 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img 
                src={selectedScreenshot} 
                alt="Payment proof slip" 
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-right">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Investment Request Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Reject Investment Request</h4>
              <button onClick={() => setRejectingRequestId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              The user's account will <strong>NOT</strong> be credited. State the reason below:
            </p>
            <textarea
              rows={3}
              value={rejectRequestReason}
              onChange={(e) => setRejectRequestReason(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectingRequestId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectRequest}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Withdrawal Modal */}
      {rejectingWithdrawalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Reject Withdrawal & Refund Balance</h4>
              <button onClick={() => setRejectingWithdrawalId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              The requested amount will be <strong>refunded</strong> back to the user's available balance.
            </p>
            <textarea
              rows={3}
              value={rejectWithdrawalReason}
              onChange={(e) => setRejectWithdrawalReason(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectingWithdrawalId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectWithdrawal}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Reject & Refund User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
