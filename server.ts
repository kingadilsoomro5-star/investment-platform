import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword, verifyPassword, UserRecord } from './server/db.js';

interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshot uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ----------------------------------------------------
// Authentication Middleware
// ----------------------------------------------------
const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.substring(7);
  const session = db.getSession(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }

  const user = db.getUserById(session.user_id);
  if (!user || user.status === 'suspended') {
    res.status(401).json({ error: 'User account not found or suspended.' });
    return;
  }

  req.user = user;
  next();
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Owner/Administrator privileges required.' });
    return;
  }
  next();
};

// Safe user serializer (strips password hash and salt)
const sanitizeUser = (user: UserRecord) => {
  const { password_hash, salt, ...safeUser } = user;
  return safeUser;
};

// ----------------------------------------------------
// Public & Auth Endpoints
// ----------------------------------------------------

// User Registration
// Rule: Start with Balance: 0, Total Investment: 0, Total Earnings: 0, Total Withdrawals: 0
app.post('/api/auth/register', (req: Request, res: Response): void => {
  try {
    const { name, email, phone, password, referral_code } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: 'Please provide full name, email, phone number, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = db.getUserByEmailOrPhone(email) || db.getUserByEmailOrPhone(phone);
    if (existingUser) {
      res.status(400).json({ error: 'An account with this email or phone number already exists.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${crypto.randomBytes(6).toString('hex')}`;
    const userReferral = `INV-${name.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = db.createUser({
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password_hash: hash,
      salt,
      role: 'user', // Always user
      referral_code: userReferral,
      referred_by: referral_code ? referral_code.trim() : null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'active'
    });

    const token = db.createSession(newUser.id, newUser.role);

    res.status(201).json({
      message: 'Account created successfully with PKR 0 starting balance.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

// User Login
app.post('/api/auth/login', (req: Request, res: Response): void => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Please enter your email or phone and password.' });
      return;
    }

    const user = db.getUserByEmailOrPhone(identifier);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. User not found.' });
      return;
    }

    if (!verifyPassword(password, user.password_hash, user.salt)) {
      res.status(401).json({ error: 'Invalid password. Please check and try again.' });
      return;
    }

    const token = db.createSession(user.id, user.role);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// Dedicated Secure Admin / Owner Login Route
app.post('/api/auth/admin-login', (req: Request, res: Response): void => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Please enter admin email/phone and password.' });
      return;
    }

    const user = db.getUserByEmailOrPhone(identifier);
    if (!user) {
      res.status(401).json({ error: 'Admin account not recognized.' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: This account does not possess Owner/Admin credentials.' });
      return;
    }

    if (!verifyPassword(password, user.password_hash, user.salt)) {
      res.status(401).json({ error: 'Invalid admin credentials.' });
      return;
    }

    const token = db.createSession(user.id, 'admin');

    res.json({
      message: 'Owner authentication verified. Welcome to InvestPro Admin Portal.',
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Admin login failed.' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ user: sanitizeUser(req.user!) });
});

// Logout
app.post('/api/auth/logout', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    db.deleteSession(token);
  }
  res.json({ message: 'Logged out successfully.' });
});

// Public Configured Payment Settings (Fetched from backend database)
app.get('/api/payment-settings', (req: Request, res: Response): void => {
  const settings = db.getPaymentSettings();
  res.json(settings);
});

// Public Investment Plans
app.get('/api/plans', (req: Request, res: Response): void => {
  const plans = db.getPlans();
  res.json(plans);
});

// ----------------------------------------------------
// User Dashboard & Operations
// ----------------------------------------------------

app.get('/api/user/dashboard', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const userRequests = db.getInvestmentRequestsByUserId(user.id);
  const userActiveInvestments = db.getActiveInvestmentsByUserId(user.id);
  const userWithdrawals = db.getWithdrawalsByUserId(user.id);
  const userTransactions = db.getTransactionsByUserId(user.id);

  const pendingRequests = userRequests.filter(r => r.status === 'pending');

  res.json({
    user: sanitizeUser(user),
    metrics: {
      balance: user.balance,
      total_investment: user.total_investment,
      today_earning: user.today_earning,
      total_earnings: user.total_earnings,
      total_withdrawals: user.total_withdrawals,
      pending_investments_count: pendingRequests.length,
      pending_investments_amount: pendingRequests.reduce((acc, curr) => acc + curr.amount, 0)
    },
    pending_investments: pendingRequests,
    investment_history: userRequests,
    active_investments: userActiveInvestments,
    withdrawals: userWithdrawals,
    transactions: userTransactions.slice(0, 20)
  });
});

// Submit Investment Request
// Important: Does NOT automatically credit balance. Needs Owner manual verification.
app.post('/api/user/investments/request', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { plan_id, transaction_id, screenshot, notes } = req.body;

    if (!plan_id || !transaction_id || !screenshot) {
      res.status(400).json({ error: 'Please provide selected plan, Transaction ID (TID), and payment screenshot.' });
      return;
    }

    const plan = db.getPlanById(plan_id);
    if (!plan) {
      res.status(404).json({ error: 'Selected investment plan not found.' });
      return;
    }

    if (plan.status === 'coming_soon') {
      res.status(400).json({ error: 'This investment plan is coming soon and cannot be purchased yet.' });
      return;
    }

    const requestId = `req_${crypto.randomBytes(5).toString('hex')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRequest = db.createInvestmentRequest({
      id: requestId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone,
      plan_id: plan.id,
      plan_name: plan.name,
      amount: plan.investment_amount,
      daily_earning: plan.daily_earning,
      transaction_id: transaction_id.trim().toUpperCase(),
      screenshot,
      status: 'pending',
      admin_note: notes ? notes.trim() : null,
      created_at: timestamp
    });

    // Record pending transaction
    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: user.id,
      user_name: user.name,
      type: 'investment_request',
      amount: plan.investment_amount,
      reference: transaction_id.trim().toUpperCase(),
      status: 'pending',
      description: `Investment request for ${plan.name} (PKR ${plan.investment_amount}) awaiting owner manual verification`,
      created_at: timestamp
    });

    res.status(201).json({
      success: true,
      message: 'Your investment request has been submitted and is waiting for verification.',
      request: newRequest
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit investment request.' });
  }
});

// User Investment History
app.get('/api/user/investments', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const requests = db.getInvestmentRequestsByUserId(req.user!.id);
  const active = db.getActiveInvestmentsByUserId(req.user!.id);
  res.json({ requests, active });
});

// User Submit Withdrawal
app.post('/api/user/withdrawals', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { amount, payment_method, account_number, account_title } = req.body;

    const withdrawAmount = Number(amount);
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      res.status(400).json({ error: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (withdrawAmount < 50) {
      res.status(400).json({ error: 'Minimum withdrawal amount is PKR 50.' });
      return;
    }

    if (user.balance < withdrawAmount) {
      res.status(400).json({ error: `Insufficient balance. Available: PKR ${user.balance}.` });
      return;
    }

    if (!payment_method || !account_number || !account_title) {
      res.status(400).json({ error: 'Please provide payment method, account number, and account title.' });
      return;
    }

    // Deduct available balance and reserve funds
    db.updateUser(user.id, {
      balance: user.balance - withdrawAmount
    });

    const withdrawalId = `wdr_${crypto.randomBytes(5).toString('hex')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const withdrawal = db.createWithdrawal({
      id: withdrawalId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      amount: withdrawAmount,
      payment_method,
      account_number: account_number.trim(),
      account_title: account_title.trim(),
      status: 'pending',
      admin_note: null,
      reference_id: `WDR-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: timestamp
    });

    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: user.id,
      user_name: user.name,
      type: 'withdrawal_request',
      amount: withdrawAmount,
      reference: withdrawal.reference_id,
      status: 'pending',
      description: `Withdrawal request of PKR ${withdrawAmount} to ${payment_method} (${account_number})`,
      created_at: timestamp
    });

    const updatedUser = db.getUserById(user.id)!;

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Awaiting compliance review.',
      withdrawal,
      user: sanitizeUser(updatedUser)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Withdrawal submission failed.' });
  }
});

// User Withdrawal History
app.get('/api/user/withdrawals', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const withdrawals = db.getWithdrawalsByUserId(req.user!.id);
  res.json(withdrawals);
});

// User Transactions
app.get('/api/user/transactions', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const transactions = db.getTransactionsByUserId(req.user!.id);
  res.json(transactions);
});

// Update Profile
app.put('/api/user/profile', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { name, phone } = req.body;

    const updates: Partial<UserRecord> = {};
    if (name && name.trim()) updates.name = name.trim();
    if (phone && phone.trim()) updates.phone = phone.trim();

    const updated = db.updateUser(user.id, updates);
    res.json({ message: 'Profile updated successfully.', user: sanitizeUser(updated!) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Profile update failed.' });
  }
});

// Change Password
app.put('/api/user/change-password', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      res.status(400).json({ error: 'Please provide both current and new password.' });
      return;
    }

    if (!verifyPassword(current_password, user.password_hash, user.salt)) {
      res.status(400).json({ error: 'Current password is incorrect.' });
      return;
    }

    if (new_password.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const { hash, salt } = hashPassword(new_password);
    db.updateUser(user.id, { password_hash: hash, salt });

    res.json({ message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Password update failed.' });
  }
});

// ----------------------------------------------------
// Secure Admin / Owner Endpoints (role: 'admin' only)
// ----------------------------------------------------

// Admin Dashboard Stats
app.get('/api/admin/stats', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const users = db.getUsers().filter(u => u.role === 'user');
  const requests = db.getInvestmentRequests();
  const withdrawals = db.getWithdrawals();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved');

  const totalInvestmentAmount = approvedRequests.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawalsAmount = approvedWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  // New users in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersCount = users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length;

  res.json({
    total_users: users.length,
    new_users: newUsersCount,
    pending_investment_requests: pendingRequests.length,
    approved_investments: approvedRequests.length,
    pending_withdrawals: pendingWithdrawals.length,
    total_investment_amount: totalInvestmentAmount,
    total_withdrawals_amount: totalWithdrawalsAmount
  });
});

// Admin Users List
app.get('/api/admin/users', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const users = db.getUsers().map(sanitizeUser);
  res.json(users);
});

// Admin Investment Requests Table
app.get('/api/admin/investment-requests', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const requests = db.getInvestmentRequests();
  res.json(requests);
});

// Owner Approves Investment Request
app.post('/api/admin/investment-requests/:id/approve', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const request = db.getInvestmentRequests().find(r => r.id === id);

    if (!request) {
      res.status(404).json({ error: 'Investment request not found.' });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({ error: `Request has already been ${request.status}.` });
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 1. Mark request approved
    const updatedRequest = db.updateInvestmentRequest(id, {
      status: 'approved',
      verified_at: timestamp,
      verified_by: req.user!.name
    });

    // 2. Update user's account records:
    // Total Investment increases by plan amount
    // Today's Earning increases by daily earning
    const targetUser = db.getUserById(request.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        total_investment: targetUser.total_investment + request.amount,
        today_earning: targetUser.today_earning + request.daily_earning,
        total_earnings: targetUser.total_earnings + request.daily_earning
      });

      // Add to active investments
      db.createActiveInvestment({
        id: `inv_${crypto.randomBytes(5).toString('hex')}`,
        user_id: targetUser.id,
        plan_id: request.plan_id,
        plan_name: request.plan_name,
        amount: request.amount,
        daily_earning: request.daily_earning,
        start_date: timestamp.split(' ')[0],
        duration_days: 30,
        days_elapsed: 0,
        total_earned: 0,
        status: 'active'
      });
    }

    // 3. Record transaction completed
    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: request.user_id,
      user_name: request.user_name,
      type: 'investment_approved',
      amount: request.amount,
      reference: request.transaction_id,
      status: 'completed',
      description: `Investment plan ${request.plan_name} verified and approved by owner (${req.user!.name})`,
      created_at: timestamp
    });

    res.json({
      success: true,
      message: `Investment request for PKR ${request.amount} approved! Plan activated for ${request.user_name}.`,
      request: updatedRequest
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Approval failed.' });
  }
});

// Owner Rejects Investment Request
app.post('/api/admin/investment-requests/:id/reject', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = db.getInvestmentRequests().find(r => r.id === id);

    if (!request) {
      res.status(404).json({ error: 'Investment request not found.' });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({ error: `Request has already been ${request.status}.` });
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedRequest = db.updateInvestmentRequest(id, {
      status: 'rejected',
      admin_note: reason || 'Payment could not be verified on EasyPaisa 03127409287',
      verified_at: timestamp,
      verified_by: req.user!.name
    });

    // Record rejected transaction
    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: request.user_id,
      user_name: request.user_name,
      type: 'investment_request',
      amount: request.amount,
      reference: request.transaction_id,
      status: 'rejected',
      description: `Investment request for ${request.plan_name} rejected: ${reason || 'Verification failed'}`,
      created_at: timestamp
    });

    res.json({
      success: true,
      message: `Investment request rejected. User account was not credited.`,
      request: updatedRequest
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Rejection failed.' });
  }
});

// Admin Withdrawals List
app.get('/api/admin/withdrawals', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const withdrawals = db.getWithdrawals();
  res.json(withdrawals);
});

// Owner Approves Withdrawal
app.post('/api/admin/withdrawals/:id/approve', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const withdrawal = db.getWithdrawals().find(w => w.id === id);

    if (!withdrawal) {
      res.status(404).json({ error: 'Withdrawal not found.' });
      return;
    }

    if (withdrawal.status !== 'pending') {
      res.status(400).json({ error: `Withdrawal has already been ${withdrawal.status}.` });
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update user total withdrawals
    const targetUser = db.getUserById(withdrawal.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        total_withdrawals: targetUser.total_withdrawals + withdrawal.amount
      });
    }

    const updated = db.updateWithdrawal(id, {
      status: 'approved',
      admin_note: note || 'Transferred successfully from official payout account',
      verified_at: timestamp
    });

    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: withdrawal.user_id,
      user_name: withdrawal.user_name,
      type: 'withdrawal_approved',
      amount: withdrawal.amount,
      reference: withdrawal.reference_id,
      status: 'completed',
      description: `Withdrawal of PKR ${withdrawal.amount} to ${withdrawal.payment_method} approved`,
      created_at: timestamp
    });

    res.json({
      success: true,
      message: `Withdrawal of PKR ${withdrawal.amount} approved!`,
      withdrawal: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Approval failed.' });
  }
});

// Owner Rejects Withdrawal (refunds user balance)
app.post('/api/admin/withdrawals/:id/reject', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const withdrawal = db.getWithdrawals().find(w => w.id === id);

    if (!withdrawal) {
      res.status(404).json({ error: 'Withdrawal not found.' });
      return;
    }

    if (withdrawal.status !== 'pending') {
      res.status(400).json({ error: `Withdrawal has already been ${withdrawal.status}.` });
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Refund user balance
    const targetUser = db.getUserById(withdrawal.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        balance: targetUser.balance + withdrawal.amount
      });
    }

    const updated = db.updateWithdrawal(id, {
      status: 'rejected',
      admin_note: reason || 'Account title mismatch or invalid wallet details',
      verified_at: timestamp
    });

    db.createTransaction({
      id: `tx_${crypto.randomBytes(5).toString('hex')}`,
      user_id: withdrawal.user_id,
      user_name: withdrawal.user_name,
      type: 'withdrawal_rejected',
      amount: withdrawal.amount,
      reference: withdrawal.reference_id,
      status: 'rejected',
      description: `Withdrawal rejected: ${reason || 'Invalid details'}. Balance PKR ${withdrawal.amount} refunded.`,
      created_at: timestamp
    });

    res.json({
      success: true,
      message: `Withdrawal rejected and PKR ${withdrawal.amount} refunded to user balance.`,
      withdrawal: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Rejection failed.' });
  }
});

// Admin Investment Plans Management
app.get('/api/admin/plans', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  res.json(db.getPlans());
});

app.put('/api/admin/plans/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updated = db.updatePlan(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Plan not found.' });
      return;
    }
    res.json({ message: 'Plan updated successfully.', plan: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Plan update failed.' });
  }
});

// Admin Payment Settings Management
app.get('/api/admin/payment-settings', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  res.json(db.getPaymentSettings());
});

app.put('/api/admin/payment-settings', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { payment_method, account_number, account_holder_name, payment_instructions } = req.body;
    const updated = db.updatePaymentSettings({
      payment_method,
      account_number,
      account_holder_name,
      payment_instructions
    });
    res.json({ message: 'Owner payment settings updated successfully.', settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Settings update failed.' });
  }
});

// Admin All Transactions Audit Log
app.get('/api/admin/transactions', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  res.json(db.getTransactions());
});

// ----------------------------------------------------
// Vite Middleware / Static Serving
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InvestPro server running on http://localhost:${PORT}`);
  });
}

startServer();
