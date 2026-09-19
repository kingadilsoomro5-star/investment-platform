export type UserPageView = 
  | 'home' 
  | 'investment' 
  | 'withdraw' 
  | 'profile' 
  | 'investment-history'
  | 'withdrawal-history'
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'admin-login'
  | 'owner-portal';

export type AdminPageView = 
  | 'dashboard' 
  | 'users' 
  | 'investment-requests' 
  | 'withdrawals' 
  | 'plans' 
  | 'payment-settings' 
  | 'transactions';

export type PageView = UserPageView | 'admin' | 'owner-portal';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  balance: number;
  total_investment: number;
  today_earning: number;
  total_earnings: number;
  total_withdrawals: number;
  referral_code: string;
  referred_by?: string | null;
  created_at: string;
  status: 'active' | 'suspended';
  avatar?: string;
  // Aliases for compatibility
  totalInvestment?: number;
  todayEarning?: number;
  totalEarnings?: number;
  totalWithdrawals?: number;
  referralCode?: string;
  joinedDate?: string;
  kycStatus?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  investment_amount: number;
  daily_earning: number;
  duration_days: number;
  status: 'active' | 'popular' | 'coming_soon';
  badge: string;
  description: string;
  // CamelCase aliases
  investmentAmount?: number;
  dailyEarning?: number;
  durationDays?: number;
  features?: string[];
  icon?: string;
  iconName?: string;
}

export interface InvestmentRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  daily_earning: number;
  transaction_id: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string | null;
  created_at: string;
  verified_at?: string | null;
  verified_by?: string | null;
  // Backward compatibility aliases
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  senderPhone?: string;
  planName?: string;
  trxId?: string;
  paymentMethod?: string;
  transactionId?: string;
  date?: string;
  submittedAt?: string;
  screenshotUrl?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface UserActiveInvestment {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  daily_earning: number;
  start_date: string;
  duration_days: number;
  days_elapsed: number;
  total_earned: number;
  status: 'active' | 'completed';
  // CamelCase aliases
  planId?: string;
  planName?: string;
  dailyEarning?: number;
  startDate?: string;
  durationDays?: number;
  daysElapsed?: number;
  totalEarned?: number;
}

export type UserInvestment = UserActiveInvestment;
export type DepositRequest = InvestmentRequest;

export interface PaymentMethodOption {
  id: string;
  name: string;
  accountTitle: string;
  accountNumber: string;
  accountLabel?: string;
  instructions: string;
  iconName: string;
}

export interface WithdrawalRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  payment_method: string;
  account_number: string;
  account_title: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string | null;
  reference_id: string;
  created_at: string;
  verified_at?: string | null;
  // CamelCase aliases
  paymentMethod?: string;
  accountNumber?: string;
  accountTitle?: string;
  referenceId?: string;
  requestedAt?: string;
  notes?: string;
}

export interface TransactionRecord {
  id: string;
  user_id: string;
  user_name: string;
  type: 'investment_request' | 'investment_approved' | 'daily_yield' | 'withdrawal_request' | 'withdrawal_approved' | 'withdrawal_rejected';
  amount: number;
  reference: string;
  status: 'pending' | 'completed' | 'rejected';
  description: string;
  created_at: string;
}

export interface PaymentSettings {
  payment_method: string;
  account_number: string;
  account_holder_name: string;
  payment_instructions: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  new_users: number;
  pending_investment_requests: number;
  approved_investments: number;
  pending_withdrawals: number;
  total_investment_amount: number;
  total_withdrawals_amount: number;
}
