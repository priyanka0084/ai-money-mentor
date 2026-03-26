const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export function getApiKey(): string | null {
  return localStorage.getItem("groq_api_key");
}

export function setApiKey(key: string) {
  localStorage.setItem("groq_api_key", key);
}

export function removeApiKey() {
  localStorage.removeItem("groq_api_key");
}

export async function callGroq(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key not configured");

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt || "Think like a senior financial advisor. Provide deep insights, not just calculations. Ensure outputs are realistic and actionable. Always respond in valid JSON when asked for JSON output.",
    },
    { role: "user" as const, content: prompt },
  ];

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

export async function analyzeTaxDocument(text: string): Promise<string> {
  const prompt = `Analyze this financial document and extract tax-relevant information. Return a JSON object with these fields:
{
  "income": { "salary": number, "other": number, "total": number },
  "deductions": {
    "section80C": { "used": number, "limit": 150000 },
    "section80D": { "used": number, "limit": 25000 },
    "section80CCD": { "used": number, "limit": 50000 },
    "hra": { "used": number, "limit": number },
    "standardDeduction": 50000
  },
  "taxOldRegime": number,
  "taxNewRegime": number,
  "savings": number,
  "recommendedRegime": "Old" or "New",
  "taxIntelligenceScore": number (0-100),
  "insights": [{ "type": "warning"|"tip"|"action", "text": string, "impact": number }],
  "strategies": [{ "title": string, "savings": number, "priority": "high"|"medium"|"low" }]
}

Document text:
${text}`;

  return callGroq(prompt);
}

export async function analyzePortfolio(text: string): Promise<string> {
  const prompt = `Analyze this portfolio/mutual fund document. Return a JSON object with:
{
  "totalValue": number,
  "returns": { "oneYear": number, "threeYear": number, "fiveYear": number },
  "healthScore": number (0-100),
  "funds": [{ "name": string, "category": string, "value": number, "allocation": number, "expenseRatio": number, "returns1Y": number }],
  "allocation": { "category": percentage },
  "riskRadar": { "risk": 0-100, "return": 0-100, "diversification": 0-100, "costEfficiency": 0-100, "overlap": 0-100 },
  "insights": [{ "type": "warning"|"tip"|"action", "text": string, "severity": "high"|"medium"|"low" }],
  "rebalanced": { "category": percentage }
}

Document text:
${text}`;

  return callGroq(prompt);
}

export async function analyzeFirePlan(data: {
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  currentInvestments: number;
  expectedReturn: number;
  inflation: number;
  retirementAge: number;
  lifeExpectancy: number;
}): Promise<string> {
  const systemPrompt = `You are an expert financial planner specializing in FIRE (Financial Independence Retire Early) for Indian users. Analyze the user's financial data and return a JSON object with EXACT structure. Always respond in valid JSON only.`;

  const prompt = `Analyze this financial data for FIRE planning:
Age: ${data.age}
Monthly Income: ₹${data.monthlyIncome}
Monthly Expenses: ₹${data.monthlyExpenses}
Current Savings: ₹${data.currentSavings}
Current Investments: ₹${data.currentInvestments}
Expected Return: ${data.expectedReturn}%
Inflation: ${data.inflation}%
Retirement Age Goal: ${data.retirementAge}
Life Expectancy: ${data.lifeExpectancy}

Return JSON:
{
  "fire_score": number (0-100),
  "retirement_age": number,
  "years_remaining": number,
  "fire_corpus_required": number,
  "current_net_worth": number,
  "monthly_sip_required": number,
  "shortfall": number,
  "wealth_projection": [{"year": number, "current_path": number, "required_path": number}],
  "monthly_plan": [{"month": number, "sip_amount": number, "equity_ratio": number, "debt_ratio": number}],
  "insurance_gap": number,
  "emergency_fund_required": number,
  "recommendations": ["string"],
  "executive_summary": "string"
}`;

  return callGroq(prompt, systemPrompt);
}

export async function analyzeHealthScore(data: {
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  totalInvestments: number;
  totalDebt: number;
  hasLifeInsurance: boolean;
  hasHealthInsurance: boolean;
  age: number;
}): Promise<string> {
  const systemPrompt = `You are a financial wellness advisor. Analyze the user's financial health across 6 dimensions and return a comprehensive score. Always respond in valid JSON only.`;

  const prompt = `Analyze financial health:
Monthly Income: ₹${data.monthlyIncome}
Monthly Expenses: ₹${data.monthlyExpenses}
Emergency Fund: ₹${data.emergencyFund}
Total Investments: ₹${data.totalInvestments}
Total Debt: ₹${data.totalDebt}
Has Life Insurance: ${data.hasLifeInsurance}
Has Health Insurance: ${data.hasHealthInsurance}
Age: ${data.age}

Return JSON:
{
  "overall_score": number (0-100),
  "dimensions": [
    {"name": "Emergency Fund", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"},
    {"name": "Insurance Coverage", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"},
    {"name": "Investment Diversification", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"},
    {"name": "Debt Health", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"},
    {"name": "Tax Efficiency", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"},
    {"name": "Retirement Readiness", "score": number, "status": "Good"/"Moderate"/"Poor", "insight": "string", "recommendation": "string"}
  ],
  "top_risks": ["string"],
  "action_plan": ["string"],
  "summary": "string"
}`;

  return callGroq(prompt, systemPrompt);
}

export async function analyzeLifeEvent(data: {
  event: string;
  amount: number;
  currentIncome: number;
  riskProfile: string;
}): Promise<string> {
  const systemPrompt = `You are an expert Indian financial advisor. Analyze the life event and provide comprehensive financial guidance. Always respond in valid JSON only.`;

  const prompt = `Analyze this life event:
Event: ${data.event}
Amount: ₹${data.amount}
Current Monthly Income: ₹${data.currentIncome}
Risk Profile: ${data.riskProfile}

Return JSON:
{
  "event": "string",
  "financial_impact": "string",
  "tax_impact": number,
  "investment_strategy": [{"instrument": "string", "allocation": number}],
  "risk_adjustment": "string",
  "mistakes_to_avoid": ["string"],
  "action_steps": ["string"],
  "summary": "string"
}`;

  return callGroq(prompt, systemPrompt);
}

export async function analyzeCouplePlan(data: {
  partnerAIncome: number;
  partnerATaxRegime: string;
  partnerAInvestments: number;
  partnerBIncome: number;
  partnerBTaxRegime: string;
  partnerBInvestments: number;
}): Promise<string> {
  const systemPrompt = `You are a financial planner for couples in India. Optimize their combined finances for maximum tax savings and wealth growth. Always respond in valid JSON only.`;

  const prompt = `Analyze couple finances:
Partner A: Income ₹${data.partnerAIncome}, Tax Regime: ${data.partnerATaxRegime}, Investments: ₹${data.partnerAInvestments}
Partner B: Income ₹${data.partnerBIncome}, Tax Regime: ${data.partnerBTaxRegime}, Investments: ₹${data.partnerBInvestments}

Return JSON:
{
  "combined_income": number,
  "combined_net_worth": number,
  "tax_savings": number,
  "optimization_strategy": ["string"],
  "investment_split": [{"partner": "A"/"B", "amount": number, "instruments": "string"}],
  "insurance_gap": number,
  "joint_goals": ["string"],
  "action_plan": ["string"],
  "summary": "string"
}`;

  return callGroq(prompt, systemPrompt);
}