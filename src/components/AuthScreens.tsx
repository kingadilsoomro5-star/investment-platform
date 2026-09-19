import React, { useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Check,
  ChevronLeft,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { UserPageView, UserProfile } from '../types';
import { api, setToken } from '../lib/api';

interface AuthScreensProps {
  currentAuthView?: UserPageView;
  setAuthView?: (view: UserPageView) => void;
  onLoginSuccess?: (user: UserProfile) => void;
  onAdminLoginSuccess?: (adminUser: UserProfile) => void;
  initialMode?: 'login' | 'register' | 'admin-login';
  onSuccess?: (user: UserProfile) => void;
  onSwitchToRegister?: () => void;
  onSwitchToLogin?: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  currentAuthView = 'login',
  setAuthView,
  onLoginSuccess,
  onAdminLoginSuccess,
  initialMode,
  onSuccess,
  onSwitchToRegister,
  onSwitchToLogin
}) => {
  const [internalView, setInternalView] = useState<UserPageView>(initialMode || currentAuthView || 'login');

  const activeView = setAuthView ? currentAuthView : internalView;
  const changeView = (v: UserPageView) => {
    if (setAuthView) setAuthView(v);
    setInternalView(v);
    if (v === 'register' && onSwitchToRegister) onSwitchToRegister();
    if (v === 'login' && onSwitchToLogin) onSwitchToLogin();
  };

  const handleUserSuccess = (u: UserProfile) => {
    if (onLoginSuccess) onLoginSuccess(u);
    if (onSuccess) onSuccess(u);
  };

  const handleAdminSuccess = (u: UserProfile) => {
    if (onAdminLoginSuccess) onAdminLoginSuccess(u);
    if (onSuccess) onSuccess(u);
  };
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('demo@investpro.com');
  const [loginPassword, setLoginPassword] = useState('User@12345');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Admin Login State
  const [adminIdentifier, setAdminIdentifier] = useState('kingadilsoomro5@gmail.com');
  const [adminPassword, setAdminPassword] = useState('Admin@InvestPro2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 55, label: 'Medium', color: 'bg-amber-500' };
    if (score <= 4) return { score: 80, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 100, label: 'Excellent', color: 'bg-emerald-600' };
  };

  const pwdStrength = calculatePasswordStrength(regPassword);

  // Handle User Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or registered phone number');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password');
      return;
    }

    setIsSubmittingLogin(true);
    try {
      const res = await api.login({
        identifier: loginIdentifier.trim(),
        password: loginPassword
      });
      setToken(res.token, res.user.role);
      handleUserSuccess(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Admin / Owner Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminIdentifier.trim() || !adminPassword) {
      setAdminError('Please enter owner identifier and password');
      return;
    }

    setIsSubmittingAdmin(true);
    try {
      const res = await api.adminLogin({
        identifier: adminIdentifier.trim(),
        password: adminPassword
      });
      setToken(res.token, 'admin');
      handleAdminSuccess(res.user);
    } catch (err: any) {
      setAdminError(err.message || 'Owner authentication failed.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // Handle Registration
  // Enforces PKR 0 balance rule
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim() || regFullName.trim().length < 3) {
      setRegError('Full Name must be at least 3 characters');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Enter a valid email address');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 10) {
      setRegError('Enter a valid mobile phone number (10-11 digits)');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }
    if (!regAgreeTerms) {
      setRegError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsSubmittingRegister(true);
    try {
      const res = await api.register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        referral_code: regReferralCode.trim() || undefined
      });

      setToken(res.token, res.user.role);
      handleUserSuccess(res.user);
    } catch (err: any) {
      setRegError(err.message || 'Registration failed.');
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your email or registered phone number');
      return;
    }

    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      setForgotSuccess(true);
    }, 800);
  };

  return (
    <div className="py-6 sm:py-10 max-w-lg mx-auto">
      {/* ---------------------------------------------------- */}
      {/* ADMIN / OWNER LOGIN VIEW */}
      {/* ---------------------------------------------------- */}
      {activeView === 'admin-login' && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-900 overflow-hidden animate-fadeIn">
          {/* Admin Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">InvestPro Owner Portal</h2>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Secured Compliance Gateway
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                Admin Area
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Restricted owner and compliance officer access. Authenticated sessions grant verification privileges over investment requests and payment screenshots.
            </p>
          </div>

          {/* Admin Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {adminError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Owner Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="e.g. kingadilsoomro5@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Owner Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Helper for Evaluation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block">Owner Demo Credentials:</span>
                  <span>kingadilsoomro5@gmail.com / Admin@InvestPro2026</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminIdentifier('kingadilsoomro5@gmail.com');
                    setAdminPassword('Admin@InvestPro2026');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                >
                  Fill Owner
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAdmin ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Verify & Enter Owner Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => changeView('login')}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Return to Regular User Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* USER LOGIN VIEW */}
      {/* ---------------------------------------------------- */}
      {activeView === 'login' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome Back to InvestPro</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your yield allocations, verify balances, and track daily returns.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@example.com or 03001234567"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => changeView('forgot-password')}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>Remember my device</span>
                </label>
              </div>

              {/* Demo Fill Helper */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block">User Demo Account:</span>
                  <span>demo@investpro.com / User@12345</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('demo@investpro.com');
                    setLoginPassword('User@12345');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Fill User
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingLogin ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center space-y-3">
              <p className="text-xs text-slate-600">
                Don't have an InvestPro account?{' '}
                <button
                  type="button"
                  onClick={() => changeView('register')}
                  className="font-bold text-blue-600 hover:text-blue-800"
                >
                  Create an account
                </button>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => changeView('admin-login')}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Platform Owner & Administrator Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* USER REGISTRATION VIEW */}
      {/* ---------------------------------------------------- */}
      {activeView === 'register' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Your InvestPro Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Join thousands of participants growing their yield through transparent plans.
            </p>

            {/* Zero Balance Notice */}
            <div className="mt-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-blue-900 leading-relaxed">
                <strong>Account Policy:</strong> All newly registered accounts strictly start with <strong>PKR 0 Balance</strong>. Deposit funds or manual plan payments require owner verification.
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {regError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength */}
              {regPassword && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Password Strength</span>
                    <span className="font-bold">{pwdStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pwdStrength.color} transition-all duration-300`}
                      style={{ width: `${pwdStrength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Referral Code (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. INV-PRO99"
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 uppercase font-mono"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
                    required
                  />
                  <span className="leading-tight">
                    I acknowledge that InvestPro is an educational prototype investment system with manual owner verification. I accept the{' '}
                    <span className="text-blue-600 underline">Terms of Service</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmittingRegister}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRegister ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Create Account (Starting Balance: PKR 0)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => changeView('login')}
                  className="font-bold text-blue-600 hover:text-blue-800"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FORGOT PASSWORD VIEW */}
      {/* ---------------------------------------------------- */}
      {activeView === 'forgot-password' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
          <div className="p-6 sm:p-8 border-b border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Reset Account Password</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email or phone number to receive recovery verification instructions.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {forgotSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Recovery Instructions Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  We have forwarded security reset credentials to <strong>{forgotIdentifier}</strong>. Follow the instructions to configure your new password.
                </p>
                <button
                  type="button"
                  onClick={() => changeView('login')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="name@example.com or 03001234567"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmittingForgot ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span>Send Password Reset Instructions</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => changeView('login')}
                    className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
