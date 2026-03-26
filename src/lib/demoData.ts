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
