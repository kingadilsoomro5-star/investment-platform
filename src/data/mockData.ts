import { 
  InvestmentPlan, 
  UserProfile, 
  WithdrawalRecord, 
  UserInvestment, 
  PaymentMethodOption, 
  DepositRequest 
} from '../types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'plan-1',
    name: 'Starter Yield',
    investment_amount: 200,
    daily_earning: 10,
    duration_days: 30,
    investmentAmount: 200,
    dailyEarning: 10,
    durationDays: 30,
    status: 'active',
    badge: 'Entry Level',
    iconName: 'sparkles',
    description: 'Designed for beginners exploring fractional earning cycles with minimal capital allocation.',
    features: [
      'Daily automated accrual of PKR 10',
      'Instant payout eligibility',
      '24/7 yield tracking on dashboard',
      'Capital lock: 30 Days'
    ]
  },
  {
    id: 'plan-2',
    name: 'Growth Plus',
    investment_amount: 300,
    daily_earning: 20,
    duration_days: 30,
    investmentAmount: 300,
    dailyEarning: 20,
    durationDays: 30,
    status: 'popular',
    badge: 'Most Popular',
    iconName: 'trending-up',
    description: 'Balanced earning pace tailored for active participants seeking enhanced daily returns.',
    features: [
      'Daily automated accrual of PKR 20',
      'Flexible withdrawal schedule',
      'Priority transaction queue',
      'Capital lock: 30 Days'
    ]
  },
  {
    id: 'plan-3',
    name: 'Premier Boost',
    investment_amount: 400,
    daily_earning: 40,
    duration_days: 30,
    investmentAmount: 400,
    dailyEarning: 40,
    durationDays: 30,
    status: 'active',
    badge: 'High Yield',
    iconName: 'shield-check',
    description: 'Accelerated yield tier structured for disciplined investors seeking competitive ratios.',
    features: [
      'Daily automated accrual of PKR 40',
      'Accelerated distribution cycle',
      'VIP customer assistance',
      'Capital lock: 30 Days'
    ]
  },
  {
    id: 'plan-4',
    name: 'Elite Vantage',
    investment_amount: 500,
    daily_earning: 55,
    duration_days: 30,
    investmentAmount: 500,
    dailyEarning: 55,
    durationDays: 30,
    status: 'active',
    badge: 'Top Tier',
    iconName: 'crown',
    description: 'Our premier standard package delivering maximum daily payout rates across regular plans.',
    features: [
      'Daily automated accrual of PKR 55',
      'Lowest withdrawal fees',
      'Dedicated account manager',
      'Capital lock: 30 Days'
    ]
  },
  {
    id: 'plan-5',
    name: 'Institutional Vault',
    investment_amount: 1000,
    daily_earning: 120,
    duration_days: 45,
    investmentAmount: 1000,
    dailyEarning: 120,
    durationDays: 45,
    status: 'coming_soon',
    badge: 'Coming Soon',
    iconName: 'layers',
    description: 'Custom bespoke investment pool for syndicates and enterprise portfolios. Launching shortly.',
    features: [
      'Customized allocation volumes',
      'Direct escrow yield agreements',
      'Institutional risk mitigations',
      'Early access waitlist open'
    ]
  }
];

export const OFFICIAL_DEPOSIT_ACCOUNT = {
  method: 'EasyPaisa',
  accountNumber: '03127409287',
  accountTitle: 'Adil Soomro (Platform Owner)',
  supportNote: 'Send deposit to this official EasyPaisa number and upload payment screenshot for owner approval.'
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_88291',
  name: 'Adil Soomro',
  email: 'kingadilsoomro5@gmail.com',
  phone: '03127409287',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  balance: 0,
  total_investment: 0,
  today_earning: 0,
  total_earnings: 0,
  total_withdrawals: 0,
  referral_code: 'INV-PRO99',
  created_at: '2026-09-01T00:00:00.000Z',
  status: 'active',
  totalInvestment: 0,
  todayEarning: 0,
  totalEarnings: 0,
  totalWithdrawals: 0,
  referralCode: 'INV-PRO99',
  joinedDate: 'September 2026',
  kycStatus: 'verified'
};

export const INITIAL_INVESTMENTS: UserInvestment[] = [
  {
    id: 'inv-101',
    user_id: 'usr_88291',
    plan_id: 'plan-2',
    plan_name: 'Growth Plus',
    amount: 300,
    daily_earning: 20,
    start_date: '2026-09-01',
    duration_days: 30,
    days_elapsed: 18,
    total_earned: 360,
    status: 'active',
    planId: 'plan-2',
    planName: 'Growth Plus',
    dailyEarning: 20,
    startDate: '2026-09-01',
    durationDays: 30,
    daysElapsed: 18,
    totalEarned: 360
  },
  {
    id: 'inv-102',
    user_id: 'usr_88291',
    plan_id: 'plan-4',
    plan_name: 'Elite Vantage',
    amount: 500,
    daily_earning: 55,
    start_date: '2026-09-10',
    duration_days: 30,
    days_elapsed: 9,
    total_earned: 495,
    status: 'active',
    planId: 'plan-4',
    planName: 'Elite Vantage',
    dailyEarning: 55,
    startDate: '2026-09-10',
    durationDays: 30,
    daysElapsed: 9,
    totalEarned: 495
  },
  {
    id: 'inv-103',
    user_id: 'usr_88291',
    plan_id: 'plan-1',
    plan_name: 'Starter Yield',
    amount: 200,
    daily_earning: 10,
    start_date: '2026-08-01',
    duration_days: 30,
    days_elapsed: 30,
    total_earned: 300,
    status: 'completed',
    planId: 'plan-1',
    planName: 'Starter Yield',
    dailyEarning: 10,
    startDate: '2026-08-01',
    durationDays: 30,
    daysElapsed: 30,
    totalEarned: 300
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wdr-7821',
    user_id: 'usr_88291',
    user_name: 'Adil Soomro',
    user_email: 'kingadilsoomro5@gmail.com',
    amount: 250,
    payment_method: 'JazzCash',
    account_number: '03009876543',
    account_title: 'Adil Soomro',
    status: 'approved',
    reference_id: 'TXN-982341-JC',
    created_at: '2026-09-16 14:32',
    paymentMethod: 'JazzCash',
    accountTitle: 'Adil Soomro',
    accountNumber: '03009876543',
    requestedAt: '2026-09-16 14:32',
    referenceId: 'TXN-982341-JC',
    notes: 'Transferred via JazzCash Agent Direct'
  },
  {
    id: 'wdr-7822',
    user_id: 'usr_88291',
    user_name: 'Adil Soomro',
    user_email: 'kingadilsoomro5@gmail.com',
    amount: 100,
    payment_method: 'EasyPaisa',
    account_number: '03451234567',
    account_title: 'Adil Soomro',
    status: 'approved',
    reference_id: 'TXN-871239-EP',
    created_at: '2026-09-12 09:15',
    paymentMethod: 'EasyPaisa',
    accountTitle: 'Adil Soomro',
    accountNumber: '03451234567',
    requestedAt: '2026-09-12 09:15',
    referenceId: 'TXN-871239-EP',
    notes: 'Successfully credited to mobile wallet'
  },
  {
    id: 'wdr-7823',
    user_id: 'usr_88291',
    user_name: 'Adil Soomro',
    user_email: 'kingadilsoomro5@gmail.com',
    amount: 300,
    payment_method: 'Raast Pay',
    account_number: '03009876543',
    account_title: 'Adil Soomro',
    status: 'pending',
    reference_id: 'TXN-551982-RS',
    created_at: '2026-09-19 10:00',
    paymentMethod: 'Raast Pay',
    accountTitle: 'Adil Soomro',
    accountNumber: '03009876543',
    requestedAt: '2026-09-19 10:00',
    referenceId: 'TXN-551982-RS',
    notes: 'Processing settlement with State Bank Raast gateway'
  }
];

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountTitle: 'Adil Soomro',
    accountNumber: '03001234567',
    accountLabel: 'JazzCash Mobile Account Number',
    instructions: 'Provide active JazzCash mobile account number.',
    iconName: 'smartphone'
  },
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    accountTitle: 'Adil Soomro',
    accountNumber: '03127409287',
    accountLabel: 'EasyPaisa Mobile Account Number',
    instructions: 'Provide active EasyPaisa mobile account number.',
    iconName: 'credit-card'
  },
  {
    id: 'raast',
    name: 'Raast Instant Pay',
    accountTitle: 'Adil Soomro',
    accountNumber: '03009876543',
    accountLabel: 'Raast ID / Registered Phone / IBAN',
    instructions: 'Provide registered Raast ID or IBAN.',
    iconName: 'zap'
  },
  {
    id: 'bank',
    name: 'Direct Bank Transfer',
    accountTitle: 'Adil Soomro',
    accountNumber: 'PK36HABB00001234567890',
    accountLabel: 'IBAN or Account Number (Any Bank)',
    instructions: 'Provide standard 24-digit IBAN.',
    iconName: 'building'
  }
];

export const INITIAL_DEPOSIT_REQUESTS: DepositRequest[] = [
  {
    id: 'dep-901',
    user_id: 'usr_sample_1',
    user_name: 'Hamza Tariq',
    user_phone: '0301 5543219',
    user_email: 'hamza.tariq@gmail.com',
    plan_id: 'plan-2',
    plan_name: 'Growth Plus (PKR 300)',
    amount: 300,
    daily_earning: 20,
    transaction_id: '37379182301',
    screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    created_at: '2026-09-19 12:15',
    userId: 'usr_sample_1',
    userName: 'Hamza Tariq',
    userPhone: '0301 5543219',
    userEmail: 'hamza.tariq@gmail.com',
    planName: 'Growth Plus (PKR 300)',
    paymentMethod: 'EasyPaisa',
    senderPhone: '03015543219',
    trxId: '37379182301',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
    submittedAt: '2026-09-19 12:15'
  },
  {
    id: 'dep-902',
    user_id: 'usr_sample_2',
    user_name: 'Bilal Ahmed',
    user_phone: '0345 8891023',
    user_email: 'bilal.ahmed99@yahoo.com',
    plan_id: 'plan-4',
    plan_name: 'Elite Vantage (PKR 500)',
    amount: 500,
    daily_earning: 55,
    transaction_id: '37378291044',
    screenshot: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    created_at: '2026-09-19 11:40',
    userId: 'usr_sample_2',
    userName: 'Bilal Ahmed',
    userPhone: '0345 8891023',
    userEmail: 'bilal.ahmed99@yahoo.com',
    planName: 'Elite Vantage (PKR 500)',
    paymentMethod: 'EasyPaisa',
    senderPhone: '03458891023',
    trxId: '37378291044',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400',
    submittedAt: '2026-09-19 11:40'
  },
  {
    id: 'dep-900',
    user_id: 'usr_sample_3',
    user_name: 'Zubair Khan',
    user_phone: '0333 1122334',
    user_email: 'zubair.k@gmail.com',
    plan_id: 'plan-1',
    plan_name: 'Starter Yield (PKR 200)',
    amount: 200,
    daily_earning: 10,
    transaction_id: '37377312099',
    screenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    status: 'approved',
    created_at: '2026-09-18 19:30',
    userId: 'usr_sample_3',
    userName: 'Zubair Khan',
    userPhone: '0333 1122334',
    userEmail: 'zubair.k@gmail.com',
    planName: 'Starter Yield (PKR 200)',
    paymentMethod: 'EasyPaisa',
    senderPhone: '03331122334',
    trxId: '37377312099',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    submittedAt: '2026-09-18 19:30'
  }
];
