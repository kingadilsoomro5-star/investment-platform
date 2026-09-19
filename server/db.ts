import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  salt: string;
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
}

export interface InvestmentPlanRecord {
  id: string;
  name: string;
  investment_amount: number;
  daily_earning: number;
  duration_days: number;
  status: 'active' | 'popular' | 'coming_soon';
  badge: string;
  description: string;
}

export interface InvestmentRequestRecord {
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

export interface PaymentSettingsRecord {
  payment_method: string;
  account_number: string;
  account_holder_name: string;
  payment_instructions: string;
  updated_at: string;
}

export interface SessionRecord {
  token: string;
  user_id: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  plans: InvestmentPlanRecord[];
  investment_requests: InvestmentRequestRecord[];
  active_investments: UserActiveInvestment[];
  withdrawals: WithdrawalRecord[];
  transactions: TransactionRecord[];
  payment_settings: PaymentSettingsRecord;
  sessions: SessionRecord[];
}

const DB_FILE = path.join(process.cwd(), 'data_store.json');

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

function getInitialDatabase(): DatabaseSchema {
  // Owner / Admin credentials
  const adminSalt = 'admin_salt_investpro_2026';
  const adminHash = hashPassword('Admin@InvestPro2026', adminSalt).hash;

  // Demo user credentials (password: 'User@12345')
  const demoSalt = 'demo_salt_investpro_2026';
  const demoHash = hashPassword('User@12345', demoSalt).hash;

  return {
    users: [
      {
        id: 'usr_owner_001',
        name: 'Adil Soomro (Owner)',
        email: 'kingadilsoomro5@gmail.com',
        phone: '03127409287',
        password_hash: adminHash,
        salt: adminSalt,
        role: 'admin',
        balance: 0,
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: 'OWNER-PRO',
        created_at: '2026-09-01 10:00:00',
        status: 'active'
      },
      {
        id: 'usr_admin_backup',
        name: 'Platform Administrator',
        email: 'admin@investpro.com',
        phone: '03001234567',
        password_hash: adminHash,
        salt: adminSalt,
        role: 'admin',
        balance: 0,
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: 'ADMIN-SYS',
        created_at: '2026-09-01 10:00:00',
        status: 'active'
      },
      {
        id: 'usr_demo_001',
        name: 'Muhammad Ali',
        email: 'demo@investpro.com',
        phone: '03219876543',
        password_hash: demoHash,
        salt: demoSalt,
        role: 'user',
        balance: 0, // Enforce starting PKR 0
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: 'ALI-7890',
        created_at: '2026-09-18 14:20:00',
        status: 'active'
      }
    ],
    plans: [
      {
        id: 'plan_1',
        name: 'Starter Yield',
        investment_amount: 200,
        daily_earning: 10,
        duration_days: 30,
        status: 'active',
        badge: 'Entry Level',
        description: 'Ideal starting tier for beginners to explore fractional yield allocations with minimal commitment.'
      },
      {
        id: 'plan_2',
        name: 'Growth Plus',
        investment_amount: 300,
        daily_earning: 20,
        duration_days: 30,
        status: 'popular',
        badge: 'Most Popular',
        description: 'Optimized daily accumulation cycle providing steady daily earnings.'
      },
      {
        id: 'plan_3',
        name: 'Premier Boost',
        investment_amount: 400,
        daily_earning: 40,
        duration_days: 30,
        status: 'active',
        badge: 'High Yield',
        description: 'Accelerated yield tier structured for active portfolio expansion.'
      },
      {
        id: 'plan_4',
        name: 'Elite Vantage',
        investment_amount: 500,
        daily_earning: 55,
        duration_days: 30,
        status: 'active',
        badge: 'Top Tier',
        description: 'Maximum daily payout plan among regular packages with priority processing.'
      },
      {
        id: 'plan_5',
        name: 'Institutional Vault',
        investment_amount: 1000,
        daily_earning: 120,
        duration_days: 45,
        status: 'coming_soon',
        badge: 'Coming Soon',
        description: 'Special syndicated investment pool currently under final compliance preparation.'
      }
    ],
    investment_requests: [
      {
        id: 'req_101',
        user_id: 'usr_demo_001',
        user_name: 'Muhammad Ali',
        user_email: 'demo@investpro.com',
        user_phone: '03219876543',
        plan_id: 'plan_4',
        plan_name: 'Elite Vantage (PKR 500)',
        amount: 500,
        daily_earning: 55,
        transaction_id: 'TXN123456',
        screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600',
        status: 'pending',
        admin_note: null,
        created_at: '2026-09-19 11:30:00'
      },
      {
        id: 'req_102',
        user_id: 'usr_sample_kashif',
        user_name: 'Kashif Mehmood',
        user_email: 'kashif.m@gmail.com',
        user_phone: '03451122334',
        plan_id: 'plan_2',
        plan_name: 'Growth Plus (PKR 300)',
        amount: 300,
        daily_earning: 20,
        transaction_id: '37379102831',
        screenshot: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=600',
        status: 'pending',
        admin_note: null,
        created_at: '2026-09-19 12:45:00'
      }
    ],
    active_investments: [],
    withdrawals: [
      {
        id: 'wdr_201',
        user_id: 'usr_demo_001',
        user_name: 'Muhammad Ali',
        user_email: 'demo@investpro.com',
        amount: 150,
        payment_method: 'EasyPaisa',
        account_number: '03219876543',
        account_title: 'Muhammad Ali',
        status: 'pending',
        admin_note: null,
        reference_id: 'WDR-9021-EP',
        created_at: '2026-09-19 09:15:00'
      }
    ],
    transactions: [
      {
        id: 'tx_301',
        user_id: 'usr_demo_001',
        user_name: 'Muhammad Ali',
        type: 'investment_request',
        amount: 500,
        reference: 'TXN123456',
        status: 'pending',
        description: 'Investment request for Elite Vantage (PKR 500) awaiting owner approval',
        created_at: '2026-09-19 11:30:00'
      },
      {
        id: 'tx_302',
        user_id: 'usr_demo_001',
        user_name: 'Muhammad Ali',
        type: 'withdrawal_request',
        amount: 150,
        reference: 'WDR-9021-EP',
        status: 'pending',
        description: 'Withdrawal request via EasyPaisa to 03219876543 awaiting verification',
        created_at: '2026-09-19 09:15:00'
      }
    ],
    payment_settings: {
      payment_method: 'EasyPaisa',
      account_number: '03127409287',
      account_holder_name: 'Adil Soomro',
      payment_instructions: '1. Open your EasyPaisa mobile app or dial *786#.\n2. Select Send Money > Mobile Account / EasyPaisa.\n3. Enter Account Number: 03127409287 and confirm Title: Adil Soomro.\n4. Send the exact investment plan amount.\n5. Copy the 3737 Transaction ID (TID) and take a screenshot of the successful payment slip.\n6. Upload the receipt proof below to submit your investment request for owner verification.',
      updated_at: '2026-09-19 10:00:00'
    },
    sessions: []
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading DB_FILE, reinitializing:', err);
    }
    const initial = getInitialDatabase();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing DB_FILE:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  // Getters
  public getUsers() {
    return this.data.users;
  }

  public getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmailOrPhone(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(
      u => u.email.toLowerCase() === clean || u.phone.replace(/[\s-]/g, '') === clean.replace(/[\s-]/g, '')
    );
  }

  public createUser(user: Omit<UserRecord, 'balance' | 'total_investment' | 'today_earning' | 'total_earnings' | 'total_withdrawals'>): UserRecord {
    // Strictly enforce 0 for new accounts
    const record: UserRecord = {
      ...user,
      balance: 0,
      total_investment: 0,
      today_earning: 0,
      total_earnings: 0,
      total_withdrawals: 0
    };
    this.data.users.push(record);
    this.save();
    return record;
  }

  public updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  // Sessions
  public createSession(userId: string, role: 'user' | 'admin'): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.data.sessions.push({
      token,
      user_id: userId,
      role,
      created_at: new Date().toISOString()
    });
    this.save();
    return token;
  }

  public getSession(token: string) {
    return this.data.sessions.find(s => s.token === token);
  }

  public deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  // Plans
  public getPlans() {
    return this.data.plans;
  }

  public getPlanById(id: string) {
    return this.data.plans.find(p => p.id === id);
  }

  public updatePlan(id: string, updates: Partial<InvestmentPlanRecord>) {
    const index = this.data.plans.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.plans[index] = { ...this.data.plans[index], ...updates };
    this.save();
    return this.data.plans[index];
  }

  public createPlan(plan: InvestmentPlanRecord) {
    this.data.plans.push(plan);
    this.save();
    return plan;
  }

  // Investment Requests
  public getInvestmentRequests() {
    return this.data.investment_requests;
  }

  public getInvestmentRequestsByUserId(userId: string) {
    return this.data.investment_requests.filter(r => r.user_id === userId);
  }

  public createInvestmentRequest(req: InvestmentRequestRecord) {
    this.data.investment_requests.unshift(req);
    this.save();
    return req;
  }

  public updateInvestmentRequest(id: string, updates: Partial<InvestmentRequestRecord>) {
    const index = this.data.investment_requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    this.data.investment_requests[index] = { ...this.data.investment_requests[index], ...updates };
    this.save();
    return this.data.investment_requests[index];
  }

  // Active Investments
  public getActiveInvestmentsByUserId(userId: string) {
    return this.data.active_investments.filter(i => i.user_id === userId);
  }

  public createActiveInvestment(inv: UserActiveInvestment) {
    this.data.active_investments.unshift(inv);
    this.save();
    return inv;
  }

  // Withdrawals
  public getWithdrawals() {
    return this.data.withdrawals;
  }

  public getWithdrawalsByUserId(userId: string) {
    return this.data.withdrawals.filter(w => w.user_id === userId);
  }

  public createWithdrawal(wdr: WithdrawalRecord) {
    this.data.withdrawals.unshift(wdr);
    this.save();
    return wdr;
  }

  public updateWithdrawal(id: string, updates: Partial<WithdrawalRecord>) {
    const index = this.data.withdrawals.findIndex(w => w.id === id);
    if (index === -1) return null;
    this.data.withdrawals[index] = { ...this.data.withdrawals[index], ...updates };
    this.save();
    return this.data.withdrawals[index];
  }

  // Transactions
  public getTransactions() {
    return this.data.transactions;
  }

  public getTransactionsByUserId(userId: string) {
    return this.data.transactions.filter(t => t.user_id === userId);
  }

  public createTransaction(tx: TransactionRecord) {
    this.data.transactions.unshift(tx);
    this.save();
    return tx;
  }

  // Payment Settings
  public getPaymentSettings() {
    return this.data.payment_settings;
  }

  public updatePaymentSettings(updates: Partial<PaymentSettingsRecord>) {
    this.data.payment_settings = {
      ...this.data.payment_settings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.payment_settings;
  }
}

export const db = new Database();
