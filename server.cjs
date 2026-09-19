var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_vite = require("vite");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "data_store.json");
function hashPassword(password, salt) {
  const actualSalt = salt || import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.pbkdf2Sync(password, actualSalt, 1e3, 64, "sha512").toString("hex");
  return { hash, salt: actualSalt };
}
function verifyPassword(password, hash, salt) {
  const check = import_crypto.default.pbkdf2Sync(password, salt, 1e3, 64, "sha512").toString("hex");
  return check === hash;
}
function getInitialDatabase() {
  const adminSalt = "admin_salt_investpro_2026";
  const adminHash = hashPassword("Admin@InvestPro2026", adminSalt).hash;
  const demoSalt = "demo_salt_investpro_2026";
  const demoHash = hashPassword("User@12345", demoSalt).hash;
  return {
    users: [
      {
        id: "usr_owner_001",
        name: "Adil Soomro (Owner)",
        email: "kingadilsoomro5@gmail.com",
        phone: "03127409287",
        password_hash: adminHash,
        salt: adminSalt,
        role: "admin",
        balance: 0,
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: "OWNER-PRO",
        created_at: "2026-09-01 10:00:00",
        status: "active"
      },
      {
        id: "usr_admin_backup",
        name: "Platform Administrator",
        email: "admin@investpro.com",
        phone: "03001234567",
        password_hash: adminHash,
        salt: adminSalt,
        role: "admin",
        balance: 0,
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: "ADMIN-SYS",
        created_at: "2026-09-01 10:00:00",
        status: "active"
      },
      {
        id: "usr_demo_001",
        name: "Muhammad Ali",
        email: "demo@investpro.com",
        phone: "03219876543",
        password_hash: demoHash,
        salt: demoSalt,
        role: "user",
        balance: 0,
        // Enforce starting PKR 0
        total_investment: 0,
        today_earning: 0,
        total_earnings: 0,
        total_withdrawals: 0,
        referral_code: "ALI-7890",
        created_at: "2026-09-18 14:20:00",
        status: "active"
      }
    ],
    plans: [
      {
        id: "plan_1",
        name: "Starter Yield",
        investment_amount: 200,
        daily_earning: 10,
        duration_days: 30,
        status: "active",
        badge: "Entry Level",
        description: "Ideal starting tier for beginners to explore fractional yield allocations with minimal commitment."
      },
      {
        id: "plan_2",
        name: "Growth Plus",
        investment_amount: 300,
        daily_earning: 20,
        duration_days: 30,
        status: "popular",
        badge: "Most Popular",
        description: "Optimized daily accumulation cycle providing steady daily earnings."
      },
      {
        id: "plan_3",
        name: "Premier Boost",
        investment_amount: 400,
        daily_earning: 40,
        duration_days: 30,
        status: "active",
        badge: "High Yield",
        description: "Accelerated yield tier structured for active portfolio expansion."
      },
      {
        id: "plan_4",
        name: "Elite Vantage",
        investment_amount: 500,
        daily_earning: 55,
        duration_days: 30,
        status: "active",
        badge: "Top Tier",
        description: "Maximum daily payout plan among regular packages with priority processing."
      },
      {
        id: "plan_5",
        name: "Institutional Vault",
        investment_amount: 1e3,
        daily_earning: 120,
        duration_days: 45,
        status: "coming_soon",
        badge: "Coming Soon",
        description: "Special syndicated investment pool currently under final compliance preparation."
      }
    ],
    investment_requests: [
      {
        id: "req_101",
        user_id: "usr_demo_001",
        user_name: "Muhammad Ali",
        user_email: "demo@investpro.com",
        user_phone: "03219876543",
        plan_id: "plan_4",
        plan_name: "Elite Vantage (PKR 500)",
        amount: 500,
        daily_earning: 55,
        transaction_id: "TXN123456",
        screenshot: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
        status: "pending",
        admin_note: null,
        created_at: "2026-09-19 11:30:00"
      },
      {
        id: "req_102",
        user_id: "usr_sample_kashif",
        user_name: "Kashif Mehmood",
        user_email: "kashif.m@gmail.com",
        user_phone: "03451122334",
        plan_id: "plan_2",
        plan_name: "Growth Plus (PKR 300)",
        amount: 300,
        daily_earning: 20,
        transaction_id: "37379102831",
        screenshot: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=600",
        status: "pending",
        admin_note: null,
        created_at: "2026-09-19 12:45:00"
      }
    ],
    active_investments: [],
    withdrawals: [
      {
        id: "wdr_201",
        user_id: "usr_demo_001",
        user_name: "Muhammad Ali",
        user_email: "demo@investpro.com",
        amount: 150,
        payment_method: "EasyPaisa",
        account_number: "03219876543",
        account_title: "Muhammad Ali",
        status: "pending",
        admin_note: null,
        reference_id: "WDR-9021-EP",
        created_at: "2026-09-19 09:15:00"
      }
    ],
    transactions: [
      {
        id: "tx_301",
        user_id: "usr_demo_001",
        user_name: "Muhammad Ali",
        type: "investment_request",
        amount: 500,
        reference: "TXN123456",
        status: "pending",
        description: "Investment request for Elite Vantage (PKR 500) awaiting owner approval",
        created_at: "2026-09-19 11:30:00"
      },
      {
        id: "tx_302",
        user_id: "usr_demo_001",
        user_name: "Muhammad Ali",
        type: "withdrawal_request",
        amount: 150,
        reference: "WDR-9021-EP",
        status: "pending",
        description: "Withdrawal request via EasyPaisa to 03219876543 awaiting verification",
        created_at: "2026-09-19 09:15:00"
      }
    ],
    payment_settings: {
      payment_method: "EasyPaisa",
      account_number: "03127409287",
      account_holder_name: "Adil Soomro",
      payment_instructions: "1. Open your EasyPaisa mobile app or dial *786#.\n2. Select Send Money > Mobile Account / EasyPaisa.\n3. Enter Account Number: 03127409287 and confirm Title: Adil Soomro.\n4. Send the exact investment plan amount.\n5. Copy the 3737 Transaction ID (TID) and take a screenshot of the successful payment slip.\n6. Upload the receipt proof below to submit your investment request for owner verification.",
      updated_at: "2026-09-19 10:00:00"
    },
    sessions: []
  };
}
var Database = class {
  constructor() {
    this.data = this.load();
  }
  load() {
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading DB_FILE, reinitializing:", err);
    }
    const initial = getInitialDatabase();
    this.saveDirect(initial);
    return initial;
  }
  saveDirect(data) {
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing DB_FILE:", err);
    }
  }
  save() {
    this.saveDirect(this.data);
  }
  // Getters
  getUsers() {
    return this.data.users;
  }
  getUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmailOrPhone(identifier) {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(
      (u) => u.email.toLowerCase() === clean || u.phone.replace(/[\s-]/g, "") === clean.replace(/[\s-]/g, "")
    );
  }
  createUser(user) {
    const record = {
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
  updateUser(id, updates) {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }
  // Sessions
  createSession(userId, role) {
    const token = import_crypto.default.randomBytes(32).toString("hex");
    this.data.sessions.push({
      token,
      user_id: userId,
      role,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.save();
    return token;
  }
  getSession(token) {
    return this.data.sessions.find((s) => s.token === token);
  }
  deleteSession(token) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }
  // Plans
  getPlans() {
    return this.data.plans;
  }
  getPlanById(id) {
    return this.data.plans.find((p) => p.id === id);
  }
  updatePlan(id, updates) {
    const index = this.data.plans.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.plans[index] = { ...this.data.plans[index], ...updates };
    this.save();
    return this.data.plans[index];
  }
  createPlan(plan) {
    this.data.plans.push(plan);
    this.save();
    return plan;
  }
  // Investment Requests
  getInvestmentRequests() {
    return this.data.investment_requests;
  }
  getInvestmentRequestsByUserId(userId) {
    return this.data.investment_requests.filter((r) => r.user_id === userId);
  }
  createInvestmentRequest(req) {
    this.data.investment_requests.unshift(req);
    this.save();
    return req;
  }
  updateInvestmentRequest(id, updates) {
    const index = this.data.investment_requests.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.data.investment_requests[index] = { ...this.data.investment_requests[index], ...updates };
    this.save();
    return this.data.investment_requests[index];
  }
  // Active Investments
  getActiveInvestmentsByUserId(userId) {
    return this.data.active_investments.filter((i) => i.user_id === userId);
  }
  createActiveInvestment(inv) {
    this.data.active_investments.unshift(inv);
    this.save();
    return inv;
  }
  // Withdrawals
  getWithdrawals() {
    return this.data.withdrawals;
  }
  getWithdrawalsByUserId(userId) {
    return this.data.withdrawals.filter((w) => w.user_id === userId);
  }
  createWithdrawal(wdr) {
    this.data.withdrawals.unshift(wdr);
    this.save();
    return wdr;
  }
  updateWithdrawal(id, updates) {
    const index = this.data.withdrawals.findIndex((w) => w.id === id);
    if (index === -1) return null;
    this.data.withdrawals[index] = { ...this.data.withdrawals[index], ...updates };
    this.save();
    return this.data.withdrawals[index];
  }
  // Transactions
  getTransactions() {
    return this.data.transactions;
  }
  getTransactionsByUserId(userId) {
    return this.data.transactions.filter((t) => t.user_id === userId);
  }
  createTransaction(tx) {
    this.data.transactions.unshift(tx);
    this.save();
    return tx;
  }
  // Payment Settings
  getPaymentSettings() {
    return this.data.payment_settings;
  }
  updatePaymentSettings(updates) {
    this.data.payment_settings = {
      ...this.data.payment_settings,
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.save();
    return this.data.payment_settings;
  }
};
var db = new Database();

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "20mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
var authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. Please log in." });
    return;
  }
  const token = authHeader.substring(7);
  const session = db.getSession(token);
  if (!session) {
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
    return;
  }
  const user = db.getUserById(session.user_id);
  if (!user || user.status === "suspended") {
    res.status(401).json({ error: "User account not found or suspended." });
    return;
  }
  req.user = user;
  next();
};
var requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Owner/Administrator privileges required." });
    return;
  }
  next();
};
var sanitizeUser = (user) => {
  const { password_hash, salt, ...safeUser } = user;
  return safeUser;
};
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, phone, password, referral_code } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: "Please provide full name, email, phone number, and password." });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }
    const existingUser = db.getUserByEmailOrPhone(email) || db.getUserByEmailOrPhone(phone);
    if (existingUser) {
      res.status(400).json({ error: "An account with this email or phone number already exists." });
      return;
    }
    const { hash, salt } = hashPassword(password);
    const userId = `usr_${import_crypto2.default.randomBytes(6).toString("hex")}`;
    const userReferral = `INV-${name.substring(0, 3).toUpperCase()}${Math.floor(1e3 + Math.random() * 9e3)}`;
    const newUser = db.createUser({
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password_hash: hash,
      salt,
      role: "user",
      // Always user
      referral_code: userReferral,
      referred_by: referral_code ? referral_code.trim() : null,
      created_at: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
      status: "active"
    });
    const token = db.createSession(newUser.id, newUser.role);
    res.status(201).json({
      message: "Account created successfully with PKR 0 starting balance.",
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Registration failed." });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: "Please enter your email or phone and password." });
      return;
    }
    const user = db.getUserByEmailOrPhone(identifier);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials. User not found." });
      return;
    }
    if (!verifyPassword(password, user.password_hash, user.salt)) {
      res.status(401).json({ error: "Invalid password. Please check and try again." });
      return;
    }
    const token = db.createSession(user.id, user.role);
    res.json({
      message: "Logged in successfully.",
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed." });
  }
});
app.post("/api/auth/admin-login", (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: "Please enter admin email/phone and password." });
      return;
    }
    const user = db.getUserByEmailOrPhone(identifier);
    if (!user) {
      res.status(401).json({ error: "Admin account not recognized." });
      return;
    }
    if (user.role !== "admin") {
      res.status(403).json({ error: "Access denied: This account does not possess Owner/Admin credentials." });
      return;
    }
    if (!verifyPassword(password, user.password_hash, user.salt)) {
      res.status(401).json({ error: "Invalid admin credentials." });
      return;
    }
    const token = db.createSession(user.id, "admin");
    res.json({
      message: "Owner authentication verified. Welcome to InvestPro Admin Portal.",
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Admin login failed." });
  }
});
app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
app.post("/api/auth/logout", authenticate, (req, res) => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    db.deleteSession(token);
  }
  res.json({ message: "Logged out successfully." });
});
app.get("/api/payment-settings", (req, res) => {
  const settings = db.getPaymentSettings();
  res.json(settings);
});
app.get("/api/plans", (req, res) => {
  const plans = db.getPlans();
  res.json(plans);
});
app.get("/api/user/dashboard", authenticate, (req, res) => {
  const user = req.user;
  const userRequests = db.getInvestmentRequestsByUserId(user.id);
  const userActiveInvestments = db.getActiveInvestmentsByUserId(user.id);
  const userWithdrawals = db.getWithdrawalsByUserId(user.id);
  const userTransactions = db.getTransactionsByUserId(user.id);
  const pendingRequests = userRequests.filter((r) => r.status === "pending");
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
app.post("/api/user/investments/request", authenticate, (req, res) => {
  try {
    const user = req.user;
    const { plan_id, transaction_id, screenshot, notes } = req.body;
    if (!plan_id || !transaction_id || !screenshot) {
      res.status(400).json({ error: "Please provide selected plan, Transaction ID (TID), and payment screenshot." });
      return;
    }
    const plan = db.getPlanById(plan_id);
    if (!plan) {
      res.status(404).json({ error: "Selected investment plan not found." });
      return;
    }
    if (plan.status === "coming_soon") {
      res.status(400).json({ error: "This investment plan is coming soon and cannot be purchased yet." });
      return;
    }
    const requestId = `req_${import_crypto2.default.randomBytes(5).toString("hex")}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
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
      status: "pending",
      admin_note: notes ? notes.trim() : null,
      created_at: timestamp
    });
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: user.id,
      user_name: user.name,
      type: "investment_request",
      amount: plan.investment_amount,
      reference: transaction_id.trim().toUpperCase(),
      status: "pending",
      description: `Investment request for ${plan.name} (PKR ${plan.investment_amount}) awaiting owner manual verification`,
      created_at: timestamp
    });
    res.status(201).json({
      success: true,
      message: "Your investment request has been submitted and is waiting for verification.",
      request: newRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to submit investment request." });
  }
});
app.get("/api/user/investments", authenticate, (req, res) => {
  const requests = db.getInvestmentRequestsByUserId(req.user.id);
  const active = db.getActiveInvestmentsByUserId(req.user.id);
  res.json({ requests, active });
});
app.post("/api/user/withdrawals", authenticate, (req, res) => {
  try {
    const user = req.user;
    const { amount, payment_method, account_number, account_title } = req.body;
    const withdrawAmount = Number(amount);
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      res.status(400).json({ error: "Please enter a valid withdrawal amount." });
      return;
    }
    if (withdrawAmount < 50) {
      res.status(400).json({ error: "Minimum withdrawal amount is PKR 50." });
      return;
    }
    if (user.balance < withdrawAmount) {
      res.status(400).json({ error: `Insufficient balance. Available: PKR ${user.balance}.` });
      return;
    }
    if (!payment_method || !account_number || !account_title) {
      res.status(400).json({ error: "Please provide payment method, account number, and account title." });
      return;
    }
    db.updateUser(user.id, {
      balance: user.balance - withdrawAmount
    });
    const withdrawalId = `wdr_${import_crypto2.default.randomBytes(5).toString("hex")}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const withdrawal = db.createWithdrawal({
      id: withdrawalId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      amount: withdrawAmount,
      payment_method,
      account_number: account_number.trim(),
      account_title: account_title.trim(),
      status: "pending",
      admin_note: null,
      reference_id: `WDR-${Math.floor(1e5 + Math.random() * 9e5)}`,
      created_at: timestamp
    });
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: user.id,
      user_name: user.name,
      type: "withdrawal_request",
      amount: withdrawAmount,
      reference: withdrawal.reference_id,
      status: "pending",
      description: `Withdrawal request of PKR ${withdrawAmount} to ${payment_method} (${account_number})`,
      created_at: timestamp
    });
    const updatedUser = db.getUserById(user.id);
    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully. Awaiting compliance review.",
      withdrawal,
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Withdrawal submission failed." });
  }
});
app.get("/api/user/withdrawals", authenticate, (req, res) => {
  const withdrawals = db.getWithdrawalsByUserId(req.user.id);
  res.json(withdrawals);
});
app.get("/api/user/transactions", authenticate, (req, res) => {
  const transactions = db.getTransactionsByUserId(req.user.id);
  res.json(transactions);
});
app.put("/api/user/profile", authenticate, (req, res) => {
  try {
    const user = req.user;
    const { name, phone } = req.body;
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (phone && phone.trim()) updates.phone = phone.trim();
    const updated = db.updateUser(user.id, updates);
    res.json({ message: "Profile updated successfully.", user: sanitizeUser(updated) });
  } catch (err) {
    res.status(500).json({ error: err.message || "Profile update failed." });
  }
});
app.put("/api/user/change-password", authenticate, (req, res) => {
  try {
    const user = req.user;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      res.status(400).json({ error: "Please provide both current and new password." });
      return;
    }
    if (!verifyPassword(current_password, user.password_hash, user.salt)) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }
    if (new_password.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters." });
      return;
    }
    const { hash, salt } = hashPassword(new_password);
    db.updateUser(user.id, { password_hash: hash, salt });
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Password update failed." });
  }
});
app.get("/api/admin/stats", authenticate, requireAdmin, (req, res) => {
  const users = db.getUsers().filter((u) => u.role === "user");
  const requests = db.getInvestmentRequests();
  const withdrawals = db.getWithdrawals();
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");
  const approvedWithdrawals = withdrawals.filter((w) => w.status === "approved");
  const totalInvestmentAmount = approvedRequests.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawalsAmount = approvedWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);
  const sevenDaysAgo = /* @__PURE__ */ new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersCount = users.filter((u) => new Date(u.created_at) >= sevenDaysAgo).length;
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
app.get("/api/admin/users", authenticate, requireAdmin, (req, res) => {
  const users = db.getUsers().map(sanitizeUser);
  res.json(users);
});
app.get("/api/admin/investment-requests", authenticate, requireAdmin, (req, res) => {
  const requests = db.getInvestmentRequests();
  res.json(requests);
});
app.post("/api/admin/investment-requests/:id/approve", authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const request = db.getInvestmentRequests().find((r) => r.id === id);
    if (!request) {
      res.status(404).json({ error: "Investment request not found." });
      return;
    }
    if (request.status !== "pending") {
      res.status(400).json({ error: `Request has already been ${request.status}.` });
      return;
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const updatedRequest = db.updateInvestmentRequest(id, {
      status: "approved",
      verified_at: timestamp,
      verified_by: req.user.name
    });
    const targetUser = db.getUserById(request.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        total_investment: targetUser.total_investment + request.amount,
        today_earning: targetUser.today_earning + request.daily_earning,
        total_earnings: targetUser.total_earnings + request.daily_earning
      });
      db.createActiveInvestment({
        id: `inv_${import_crypto2.default.randomBytes(5).toString("hex")}`,
        user_id: targetUser.id,
        plan_id: request.plan_id,
        plan_name: request.plan_name,
        amount: request.amount,
        daily_earning: request.daily_earning,
        start_date: timestamp.split(" ")[0],
        duration_days: 30,
        days_elapsed: 0,
        total_earned: 0,
        status: "active"
      });
    }
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: request.user_id,
      user_name: request.user_name,
      type: "investment_approved",
      amount: request.amount,
      reference: request.transaction_id,
      status: "completed",
      description: `Investment plan ${request.plan_name} verified and approved by owner (${req.user.name})`,
      created_at: timestamp
    });
    res.json({
      success: true,
      message: `Investment request for PKR ${request.amount} approved! Plan activated for ${request.user_name}.`,
      request: updatedRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Approval failed." });
  }
});
app.post("/api/admin/investment-requests/:id/reject", authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = db.getInvestmentRequests().find((r) => r.id === id);
    if (!request) {
      res.status(404).json({ error: "Investment request not found." });
      return;
    }
    if (request.status !== "pending") {
      res.status(400).json({ error: `Request has already been ${request.status}.` });
      return;
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const updatedRequest = db.updateInvestmentRequest(id, {
      status: "rejected",
      admin_note: reason || "Payment could not be verified on EasyPaisa 03127409287",
      verified_at: timestamp,
      verified_by: req.user.name
    });
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: request.user_id,
      user_name: request.user_name,
      type: "investment_request",
      amount: request.amount,
      reference: request.transaction_id,
      status: "rejected",
      description: `Investment request for ${request.plan_name} rejected: ${reason || "Verification failed"}`,
      created_at: timestamp
    });
    res.json({
      success: true,
      message: `Investment request rejected. User account was not credited.`,
      request: updatedRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Rejection failed." });
  }
});
app.get("/api/admin/withdrawals", authenticate, requireAdmin, (req, res) => {
  const withdrawals = db.getWithdrawals();
  res.json(withdrawals);
});
app.post("/api/admin/withdrawals/:id/approve", authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const withdrawal = db.getWithdrawals().find((w) => w.id === id);
    if (!withdrawal) {
      res.status(404).json({ error: "Withdrawal not found." });
      return;
    }
    if (withdrawal.status !== "pending") {
      res.status(400).json({ error: `Withdrawal has already been ${withdrawal.status}.` });
      return;
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const targetUser = db.getUserById(withdrawal.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        total_withdrawals: targetUser.total_withdrawals + withdrawal.amount
      });
    }
    const updated = db.updateWithdrawal(id, {
      status: "approved",
      admin_note: note || "Transferred successfully from official payout account",
      verified_at: timestamp
    });
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: withdrawal.user_id,
      user_name: withdrawal.user_name,
      type: "withdrawal_approved",
      amount: withdrawal.amount,
      reference: withdrawal.reference_id,
      status: "completed",
      description: `Withdrawal of PKR ${withdrawal.amount} to ${withdrawal.payment_method} approved`,
      created_at: timestamp
    });
    res.json({
      success: true,
      message: `Withdrawal of PKR ${withdrawal.amount} approved!`,
      withdrawal: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Approval failed." });
  }
});
app.post("/api/admin/withdrawals/:id/reject", authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const withdrawal = db.getWithdrawals().find((w) => w.id === id);
    if (!withdrawal) {
      res.status(404).json({ error: "Withdrawal not found." });
      return;
    }
    if (withdrawal.status !== "pending") {
      res.status(400).json({ error: `Withdrawal has already been ${withdrawal.status}.` });
      return;
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const targetUser = db.getUserById(withdrawal.user_id);
    if (targetUser) {
      db.updateUser(targetUser.id, {
        balance: targetUser.balance + withdrawal.amount
      });
    }
    const updated = db.updateWithdrawal(id, {
      status: "rejected",
      admin_note: reason || "Account title mismatch or invalid wallet details",
      verified_at: timestamp
    });
    db.createTransaction({
      id: `tx_${import_crypto2.default.randomBytes(5).toString("hex")}`,
      user_id: withdrawal.user_id,
      user_name: withdrawal.user_name,
      type: "withdrawal_rejected",
      amount: withdrawal.amount,
      reference: withdrawal.reference_id,
      status: "rejected",
      description: `Withdrawal rejected: ${reason || "Invalid details"}. Balance PKR ${withdrawal.amount} refunded.`,
      created_at: timestamp
    });
    res.json({
      success: true,
      message: `Withdrawal rejected and PKR ${withdrawal.amount} refunded to user balance.`,
      withdrawal: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Rejection failed." });
  }
});
app.get("/api/admin/plans", authenticate, requireAdmin, (req, res) => {
  res.json(db.getPlans());
});
app.put("/api/admin/plans/:id", authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updatePlan(id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Plan not found." });
      return;
    }
    res.json({ message: "Plan updated successfully.", plan: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Plan update failed." });
  }
});
app.get("/api/admin/payment-settings", authenticate, requireAdmin, (req, res) => {
  res.json(db.getPaymentSettings());
});
app.put("/api/admin/payment-settings", authenticate, requireAdmin, (req, res) => {
  try {
    const { payment_method, account_number, account_holder_name, payment_instructions } = req.body;
    const updated = db.updatePaymentSettings({
      payment_method,
      account_number,
      account_holder_name,
      payment_instructions
    });
    res.json({ message: "Owner payment settings updated successfully.", settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Settings update failed." });
  }
});
app.get("/api/admin/transactions", authenticate, requireAdmin, (req, res) => {
  res.json(db.getTransactions());
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InvestPro server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
