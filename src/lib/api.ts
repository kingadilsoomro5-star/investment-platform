import { 
  UserProfile, 
  InvestmentPlan, 
  InvestmentRequest, 
  UserActiveInvestment, 
  WithdrawalRecord, 
  TransactionRecord, 
  PaymentSettings, 
  AdminStats 
} from '../types';

const TOKEN_KEY = 'investpro_token';
const ROLE_KEY = 'investpro_role';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, role: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getStoredRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; phone: string; password: string; referral_code?: string }) =>
    request<{ message: string; token: string; user: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload: { identifier: string; password: string }) =>
    request<{ message: string; token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  adminLogin: (payload: { identifier: string; password: string }) =>
    request<{ message: string; token: string; user: UserProfile }>('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => request<{ user: UserProfile }>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }).finally(() => {
      clearToken();
    }),

  // Public / Shared
  getPaymentSettings: () => request<PaymentSettings>('/api/payment-settings'),
  getPlans: () => request<InvestmentPlan[]>('/api/plans'),

  // User Endpoints
  getUserDashboard: () =>
    request<{
      user: UserProfile;
      metrics: {
        balance: number;
        total_investment: number;
        today_earning: number;
        total_earnings: number;
        total_withdrawals: number;
        pending_investments_count: number;
        pending_investments_amount: number;
      };
      pending_investments: InvestmentRequest[];
      pending_requests?: InvestmentRequest[];
      investment_history: InvestmentRequest[];
      active_investments: UserActiveInvestment[];
      withdrawals: WithdrawalRecord[];
      transactions: TransactionRecord[];
      recent_transactions?: TransactionRecord[];
    }>('/api/user/dashboard'),

  getDashboard: () =>
    request<{
      user: UserProfile;
      metrics: {
        balance: number;
        total_investment: number;
        today_earning: number;
        total_earnings: number;
        total_withdrawals: number;
        pending_investments_count: number;
        pending_investments_amount: number;
      };
      pending_investments: InvestmentRequest[];
      pending_requests?: InvestmentRequest[];
      investment_history: InvestmentRequest[];
      active_investments: UserActiveInvestment[];
      withdrawals: WithdrawalRecord[];
      transactions: TransactionRecord[];
      recent_transactions?: TransactionRecord[];
    }>('/api/user/dashboard'),

  getMyWithdrawals: () => request<WithdrawalRecord[]>('/api/user/withdrawals'),
  getMyInvestmentRequests: () =>
    request<{ requests: InvestmentRequest[]; active: UserActiveInvestment[] }>('/api/user/investments').then(
      res => res.requests
    ),

  submitInvestmentRequest: (payload: {
    plan_id: string;
    transaction_id: string;
    screenshot: string;
    notes?: string;
  }) =>
    request<{ success: boolean; message: string; request: InvestmentRequest }>(
      '/api/user/investments/request',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    ),

  getUserInvestments: () =>
    request<{ requests: InvestmentRequest[]; active: UserActiveInvestment[] }>('/api/user/investments'),

  submitWithdrawal: (payload: {
    amount: number;
    payment_method: string;
    account_number: string;
    account_title: string;
  }) =>
    request<{ success: boolean; message: string; withdrawal: WithdrawalRecord; user: UserProfile }>(
      '/api/user/withdrawals',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    ),

  getUserWithdrawals: () => request<WithdrawalRecord[]>('/api/user/withdrawals'),
  getUserTransactions: () => request<TransactionRecord[]>('/api/user/transactions'),

  updateProfile: (payload: { name?: string; phone?: string }) =>
    request<{ message: string; user: UserProfile }>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  changePassword: (payload: { current_password: string; new_password: string }) =>
    request<{ message: string }>('/api/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Admin Endpoints
  getAdminStats: () => request<AdminStats>('/api/admin/stats'),
  getAdminUsers: () => request<UserProfile[]>('/api/admin/users'),
  getAdminInvestmentRequests: () => request<InvestmentRequest[]>('/api/admin/investment-requests'),
  approveInvestmentRequest: (id: string) =>
    request<{ success: boolean; message: string; request: InvestmentRequest }>(
      `/api/admin/investment-requests/${id}/approve`,
      { method: 'POST' }
    ),
  rejectInvestmentRequest: (id: string, reason?: string) =>
    request<{ success: boolean; message: string; request: InvestmentRequest }>(
      `/api/admin/investment-requests/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason })
      }
    ),
  getAdminWithdrawals: () => request<WithdrawalRecord[]>('/api/admin/withdrawals'),
  approveWithdrawal: (id: string, note?: string) =>
    request<{ success: boolean; message: string; withdrawal: WithdrawalRecord }>(
      `/api/admin/withdrawals/${id}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ note })
      }
    ),
  rejectWithdrawal: (id: string, reason?: string) =>
    request<{ success: boolean; message: string; withdrawal: WithdrawalRecord }>(
      `/api/admin/withdrawals/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason })
      }
    ),
  getAdminPlans: () => request<InvestmentPlan[]>('/api/admin/plans'),
  updateAdminPlan: (id: string, payload: Partial<InvestmentPlan>) =>
    request<{ message: string; plan: InvestmentPlan }>(`/api/admin/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  getAdminPaymentSettings: () => request<PaymentSettings>('/api/admin/payment-settings'),
  updateAdminPaymentSettings: (payload: Partial<PaymentSettings>) =>
    request<{ message: string; settings: PaymentSettings }>('/api/admin/payment-settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  getAdminTransactions: () => request<TransactionRecord[]>('/api/admin/transactions')
};
