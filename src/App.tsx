import React, { useState, useEffect } from 'react';
import { 
  PageView, 
  UserProfile, 
  InvestmentPlan, 
  UserActiveInvestment, 
  InvestmentRequest, 
  WithdrawalRecord, 
  PaymentSettings,
  TransactionRecord
} from './types';
import { api } from './lib/api';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AuthScreens } from './components/AuthScreens';
import { HomeView } from './components/HomeView';
import { InvestmentView } from './components/InvestmentView';
import { WithdrawView } from './components/WithdrawView';
import { ProfileView } from './components/ProfileView';
import { AdminPortalView } from './components/AdminPortalView';
import { ManualPaymentModal } from './components/ManualPaymentModal';
import { CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Core Data Collections
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [activeInvestments, setActiveInvestments] = useState<UserActiveInvestment[]>([]);
  const [investmentRequests, setInvestmentRequests] = useState<InvestmentRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Modals
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<InvestmentPlan | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Data Bootstrap
  const initApp = async () => {
    try {
      setLoading(true);
      // Fetch public plans & payment settings
      const [plansData, settingsData] = await Promise.all([
        api.getPlans(),
        api.getPaymentSettings()
      ]);
      setPlans(plansData);
      setPaymentSettings(settingsData);

      // Check for existing session token
      const token = localStorage.getItem('investpro_token');
      if (token) {
        try {
          const meRes = await api.getMe();
          setUser(meRes.user);
          setIsLoggedIn(true);

          // Fetch user dashboard
          const dashRes = await api.getDashboard();
          setActiveInvestments(dashRes.active_investments || []);
          setInvestmentRequests(dashRes.pending_requests || []);
          setTransactions(dashRes.recent_transactions || []);

          // Fetch user withdrawals
          const wRes = await api.getMyWithdrawals();
          setWithdrawals(wRes || []);

          // Fetch all user investment requests
          const reqRes = await api.getMyInvestmentRequests();
          setInvestmentRequests(reqRes || []);
        } catch (authErr) {
          console.warn('Session expired or invalid token:', authErr);
          api.logout();
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    } catch (err) {
      console.error('Failed to initialize app:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  // Refresh user data after an action (deposit, withdrawal, approval)
  const refreshUserData = async () => {
    try {
      if (!isLoggedIn) return;
      const [meRes, dashRes, wRes, reqRes] = await Promise.all([
        api.getMe(),
        api.getDashboard(),
        api.getMyWithdrawals(),
        api.getMyInvestmentRequests()
      ]);
      setUser(meRes.user);
      setActiveInvestments(dashRes.active_investments || []);
      setTransactions(dashRes.recent_transactions || []);
      setWithdrawals(wRes || []);
      setInvestmentRequests(reqRes || []);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    showToast(`Welcome back, ${loggedInUser.name}!`);
    if (loggedInUser.role === 'admin') {
      setCurrentPage('owner-portal');
    } else {
      setCurrentPage('home');
    }
    refreshUserData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('login');
    showToast('You have been securely signed out.', 'info');
  };

  // Plan selection -> open manual payment modal
  const handleSelectPlan = (plan: InvestmentPlan) => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      showToast('Please login to activate an investment plan.', 'info');
      return;
    }
    setSelectedPlanForModal(plan);
  };

  // When user submits manual investment request
  const handleInvestmentRequestSubmitted = (newRequest: InvestmentRequest) => {
    setInvestmentRequests(prev => [newRequest, ...prev]);
    showToast('Payment slip submitted! Awaiting manual verification by owner Adil Soomro.', 'success');
    refreshUserData();
  };

  // When user submits withdrawal
  const handleWithdrawalSubmitted = (newWithdrawal: WithdrawalRecord, updatedUser: UserProfile) => {
    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setUser(updatedUser);
    showToast(`Withdrawal request of PKR ${newWithdrawal.amount} submitted. Status: Pending.`, 'success');
    refreshUserData();
  };

  // Profile update
  const handleProfileUpdated = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    showToast('Profile updated successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-700 font-display">InvestPro Portfolio Engine...</p>
        </div>
      </div>
    );
  }

  // If Admin Portal is selected and user is admin
  if (currentPage === 'owner-portal' && user && user.role === 'admin') {
    return (
      <AdminPortalView
        adminUser={user}
        onLogoutAdmin={handleLogout}
        onReturnToUserApp={() => setCurrentPage('home')}
      />
    );
  }

  // If on Auth Screens (Login / Register)
  if (currentPage === 'login' || currentPage === 'register' || (!isLoggedIn && currentPage !== 'home' && currentPage !== 'investment')) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onOpenDeposit={() => {
            if (plans.length > 0) handleSelectPlan(plans[0]);
          }}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex items-center justify-center">
          <AuthScreens
            initialMode={currentPage === 'register' ? 'register' : 'login'}
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentPage('register')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        </main>

        <Footer setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-fadeIn max-w-sm">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
            toast.type === 'error' 
              ? 'bg-rose-900 text-white border-rose-800' 
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-900 text-white border-emerald-800'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenDeposit={() => {
          if (plans.length > 0) handleSelectPlan(plans[0]);
        }}
      />

      {/* Main Content Pages */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentPage === 'home' && (
          user ? (
            <HomeView
              user={user}
              plans={plans}
              setCurrentPage={(p) => setCurrentPage(p as PageView)}
              onSelectPlan={handleSelectPlan}
              onOpenDeposit={() => {
                if (plans.length > 0) handleSelectPlan(plans[0]);
              }}
              investmentRequests={investmentRequests}
              activeInvestments={activeInvestments}
              transactions={transactions}
            />
          ) : (
            // Public landing / guest view
            <div className="space-y-12 py-8 animate-fadeIn">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified High-Yield Platform
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
                  Grow Your Capital with <span className="text-blue-600">InvestPro</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                  Transparent fixed-yield investment management. Register an account, choose your tier, and deposit via official EasyPaisa account to start earning daily returns.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Open Zero-Balance Account
                  </button>
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Public Plans preview */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Featured Investment Plans</h2>
                  <p className="text-xs text-slate-500">Tiered micro-allocations with daily yield distribution</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.filter(p => p.status !== 'coming_soon').map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          +{p.daily_earning} PKR/day
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        PKR {p.investment_amount}
                      </div>
                      <button
                        onClick={() => setCurrentPage('register')}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Start Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {currentPage === 'investment' && user && (
          <InvestmentView
            plans={plans}
            user={user}
            activeInvestments={activeInvestments}
            investmentRequests={investmentRequests}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentPage === 'withdraw' && user && (
          <WithdrawView
            user={user}
            withdrawals={withdrawals}
            onWithdrawalSubmitted={handleWithdrawalSubmitted}
          />
        )}

        {currentPage === 'profile' && user && (
          <ProfileView
            user={user}
            onUpdateProfile={handleProfileUpdated}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Manual Payment Verification Modal */}
      <ManualPaymentModal
        isOpen={selectedPlanForModal !== null}
        onClose={() => setSelectedPlanForModal(null)}
        selectedPlan={selectedPlanForModal}
        paymentSettings={paymentSettings}
        onRequestSubmitted={handleInvestmentRequestSubmitted}
        onNavigateToHistory={() => {
          setSelectedPlanForModal(null);
          setCurrentPage('investment');
        }}
      />

      {/* Mobile Bottom Bar */}
      <MobileNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        user={user}
      />

      {/* Desktop & Tablet Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
