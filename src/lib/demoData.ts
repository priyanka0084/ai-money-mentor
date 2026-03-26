export const demoTaxData = {
  income: {
    salary: 1850000,
    other: 120000,
    total: 1970000,
  },
  deductions: {
    section80C: { used: 100000, limit: 150000 },
    section80D: { used: 0, limit: 25000 },
    section80CCD: { used: 0, limit: 50000 },
    hra: { used: 180000, limit: 240000 },
    standardDeduction: 50000,
  },
  taxOldRegime: 312000,
  taxNewRegime: 293800,
  savings: 18200,
  recommendedRegime: "New" as const,
  taxIntelligenceScore: 58,
  insights: [
    { type: "warning" as const, text: "You are underutilizing Section 80C by ₹50,000", impact: 15600 },
    { type: "tip" as const, text: "Switching to new regime saves ₹18,200 this year", impact: 18200 },
    { type: "action" as const, text: "Invest ₹50,000 in ELSS before March to maximize 80C", impact: 15600 },
    { type: "action" as const, text: "Add health insurance to save ₹7,500 under 80D", impact: 7500 },
    { type: "warning" as const, text: "NPS contribution of ₹50,000 gives extra deduction under 80CCD(1B)", impact: 15600 },
  ],
  strategies: [
    { title: "Invest ₹50,000 in ELSS before March", savings: 15600, priority: "high" as const },
    { title: "Start health insurance (₹25,000 premium)", savings: 7500, priority: "high" as const },
    { title: "Contribute ₹50,000 to NPS", savings: 15600, priority: "medium" as const },
    { title: "Claim HRA gap of ₹60,000", savings: 18720, priority: "medium" as const },
  ],
};

export const demoPortfolioData = {
  totalValue: 2450000,
  returns: { oneYear: 14.2, threeYear: 11.8, fiveYear: 13.5 },
  healthScore: 62,
  funds: [
    { name: "HDFC Top 100 Fund", category: "Large Cap", value: 680000, allocation: 27.8, expenseRatio: 1.62, returns1Y: 12.4 },
    { name: "SBI Bluechip Fund", category: "Large Cap", value: 520000, allocation: 21.2, expenseRatio: 1.48, returns1Y: 11.8 },
    { name: "Axis Midcap Fund", category: "Mid Cap", value: 450000, allocation: 18.4, expenseRatio: 0.52, returns1Y: 18.2 },
    { name: "Parag Parikh Flexi Cap", category: "Flexi Cap", value: 380000, allocation: 15.5, expenseRatio: 0.63, returns1Y: 16.5 },
    { name: "ICICI Pru Technology Fund", category: "Sectoral", value: 280000, allocation: 11.4, expenseRatio: 1.85, returns1Y: 22.1 },
    { name: "Nippon Small Cap Fund", category: "Small Cap", value: 140000, allocation: 5.7, expenseRatio: 0.98, returns1Y: 24.8 },
  ],
  allocation: {
    "Large Cap": 49,
    "Mid Cap": 18.4,
    "Flexi Cap": 15.5,
    "Sectoral": 11.4,
    "Small Cap": 5.7,
  },
  riskRadar: {
    risk: 55,
    return: 72,
    diversification: 45,
    costEfficiency: 58,
    overlap: 35,
  },
  insights: [
    { type: "warning" as const, text: "You are overexposed to Large Cap (49%)", severity: "high" as const },
    { type: "warning" as const, text: "HDFC Top 100 & SBI Bluechip have 78% overlap", severity: "high" as const },
    { type: "tip" as const, text: "You are paying ₹12,000 extra yearly in expense ratios", severity: "medium" as const },
    { type: "action" as const, text: "Consider replacing SBI Bluechip with a Mid Cap fund", severity: "medium" as const },
    { type: "tip" as const, text: "Add international exposure for better diversification", severity: "low" as const },
  ],
  rebalanced: {
    "Large Cap": 30,
    "Mid Cap": 25,
    "Flexi Cap": 20,
    "Small Cap": 10,
    "International": 10,
    "Debt": 5,
  },
};

export const dashboardInsights = [
  { icon: "💰", text: "You are losing ₹38,500/year in taxes", type: "alert" as const, color: "destructive" },
  { icon: "📉", text: "Your portfolio has 32% overlap risk", type: "warning" as const, color: "score-good" },
  { icon: "⚠️", text: "High expense ratio detected in 2 funds", type: "info" as const, color: "accent" },
];

export const demoFireData = {
  fire_score: 42,
  retirement_age: 55,
  years_remaining: 25,
  fire_corpus_required: 52000000,
  current_net_worth: 3200000,
  monthly_sip_required: 45000,
  shortfall: 48800000,
  wealth_projection: [
    { year: 2025, current_path: 3200000, required_path: 3200000 },
    { year: 2030, current_path: 6800000, required_path: 12000000 },
    { year: 2035, current_path: 12500000, required_path: 22000000 },
    { year: 2040, current_path: 20000000, required_path: 35000000 },
    { year: 2045, current_path: 30000000, required_path: 45000000 },
    { year: 2050, current_path: 38000000, required_path: 52000000 },
  ],
  monthly_plan: [
    { month: 1, sip_amount: 35000, equity_ratio: 80, debt_ratio: 20 },
    { month: 6, sip_amount: 38000, equity_ratio: 75, debt_ratio: 25 },
    { month: 12, sip_amount: 42000, equity_ratio: 70, debt_ratio: 30 },
    { month: 24, sip_amount: 45000, equity_ratio: 65, debt_ratio: 35 },
    { month: 36, sip_amount: 48000, equity_ratio: 60, debt_ratio: 40 },
  ],
  insurance_gap: 5000000,
  emergency_fund_required: 600000,
  recommendations: [
    "Increase SIP by ₹10,000/month to bridge the corpus gap",
    "Build emergency fund of ₹6L before aggressive investing",
    "Consider NPS for additional tax savings and retirement corpus",
    "Get term insurance of ₹50L immediately",
  ],
  executive_summary: "You're on a moderate path to FIRE. Your current savings rate needs improvement. With disciplined investing of ₹45,000/month, you can achieve financial independence by age 55.",
};

export const demoHealthScoreData = {
  overall_score: 58,
  dimensions: [
    { name: "Emergency Fund", score: 35, status: "Poor" as const, insight: "Only 2 months of expenses covered. Need 6 months.", recommendation: "Build ₹6L emergency fund in a liquid fund" },
    { name: "Insurance Coverage", score: 40, status: "Poor" as const, insight: "No term insurance. Health cover is insufficient.", recommendation: "Get ₹1Cr term plan + ₹10L health insurance" },
    { name: "Investment Diversification", score: 65, status: "Moderate" as const, insight: "Over-concentrated in large caps. Missing international exposure.", recommendation: "Add 10-15% international and debt allocation" },
    { name: "Debt Health", score: 85, status: "Good" as const, insight: "No high-interest debt. Home loan at reasonable rate.", recommendation: "Consider prepaying home loan with bonus income" },
    { name: "Tax Efficiency", score: 55, status: "Moderate" as const, insight: "Section 80C and 80D not fully utilized.", recommendation: "Invest in ELSS and get health insurance" },
    { name: "Retirement Readiness", score: 45, status: "Poor" as const, insight: "Current trajectory won't meet retirement goals.", recommendation: "Increase SIP by 20% and add NPS contribution" },
  ],
  top_risks: [
    "No life insurance coverage for dependents",
    "Emergency fund critically low",
    "Retirement corpus severely underfunded",
  ],
  action_plan: [
    "Week 1: Get term insurance quote and apply",
    "Week 2: Open liquid fund for emergency savings",
    "Month 1: Start ₹25,000 additional SIP in ELSS",
    "Month 2: Review and rebalance portfolio allocation",
  ],
  summary: "Your financial health needs attention in 3 critical areas: insurance, emergency fund, and retirement planning. Debt management is your strongest dimension.",
};

export const demoLifeEventData = {
  event: "Bonus",
  financial_impact: "A ₹5,00,000 bonus provides a significant opportunity to optimize your financial position across tax savings, investments, and debt reduction.",
  tax_impact: 156000,
  investment_strategy: [
    { instrument: "ELSS Mutual Fund", allocation: 30 },
    { instrument: "PPF", allocation: 15 },
    { instrument: "NPS Tier 1", allocation: 15 },
    { instrument: "Index Fund SIP", allocation: 25 },
    { instrument: "Emergency Fund Top-up", allocation: 15 },
  ],
  risk_adjustment: "Since this is a lump sum, consider staggered investment over 3-6 months via STP to reduce timing risk.",
  mistakes_to_avoid: [
    "Don't spend more than 10% on lifestyle upgrades",
    "Avoid locking entire amount in fixed deposits",
    "Don't invest lump sum in equity at market highs",
    "Don't ignore tax planning opportunities",
  ],
  action_steps: [
    "Set aside ₹50,000 for celebration/personal spending",
    "Invest ₹1,50,000 in ELSS for 80C benefit immediately",
    "Put ₹75,000 in NPS for additional 80CCD(1B) deduction",
    "Start STP of ₹2,25,000 into index fund over 3 months",
  ],
  summary: "Your bonus of ₹5L can save you ₹1.56L in taxes if allocated smartly across ELSS, NPS, and PPF. Invest the remainder via STP for optimal returns.",
};

export const demoCoupleData = {
  combined_income: 3200000,
  combined_net_worth: 8500000,
  tax_savings: 185000,
  optimization_strategy: [
    "Partner B should claim HRA (higher rent city)",
    "Split 80C investments: Partner A → ELSS, Partner B → PPF",
    "Partner A to invest in NPS for additional 80CCD(1B)",
    "File returns separately for maximum deductions",
    "Invest in Partner B's name for lower tax slab benefit",
  ],
  investment_split: [
    { partner: "A", amount: 35000, instruments: "ELSS + Mid Cap Fund" },
    { partner: "B", amount: 25000, instruments: "PPF + Large Cap Index" },
  ],
  insurance_gap: 8000000,
  joint_goals: [
    "Build joint emergency fund of ₹10L",
    "Save for home down payment: ₹25L in 3 years",
    "Child education fund: ₹50L in 15 years",
  ],
  action_plan: [
    "Open joint savings account for shared expenses",
    "Partner A: Get ₹1Cr term insurance",
    "Partner B: Get ₹75L term insurance",
    "Start joint SIP of ₹60,000/month",
    "Review combined portfolio quarterly",
  ],
  summary: "As a couple, you can save ₹1.85L more in taxes by optimizing deduction splits. Your combined investment capacity of ₹60,000/month puts you on track for all major goals.",
};