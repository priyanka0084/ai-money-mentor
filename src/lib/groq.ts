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
