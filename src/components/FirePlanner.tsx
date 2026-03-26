import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Flame, TrendingUp, Calendar, IndianRupee, Target, ArrowRight } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import AnimatedCounter from "./AnimatedCounter";
import InsightCard from "./InsightCard";
import { demoFireData } from "@/lib/demoData";
import { analyzeFirePlan, getApiKey } from "@/lib/groq";

const FirePlanner = () => {
  const [data, setData] = useState(demoFireData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    age: 30,
    monthlyIncome: 100000,
    monthlyExpenses: 50000,
    currentSavings: 500000,
    currentInvestments: 2700000,
    expectedReturn: 10,
    inflation: 6,
    retirementAge: 55,
    lifeExpectancy: 85,
  });

  const handleChange = (field: string, value: number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    if (!getApiKey()) { setIsDemo(true); return; }
    setProcessing(true);
    try {
      const result = await analyzeFirePlan(form);
      const parsed = JSON.parse(result);
      setData(parsed);
      setIsDemo(false);
    } catch {
      setIsDemo(true);
    } finally {
      setProcessing(false);
    }
  };

  const fields = [
    { key: "age", label: "Age", icon: "👤", suffix: "years" },
    { key: "monthlyIncome", label: "Monthly Income", icon: "💰", prefix: "₹" },
    { key: "monthlyExpenses", label: "Monthly Expenses", icon: "💸", prefix: "₹" },
    { key: "currentSavings", label: "Current Savings", icon: "🏦", prefix: "₹" },
    { key: "currentInvestments", label: "Investments", icon: "📈", prefix: "₹" },
    { key: "expectedReturn", label: "Expected Return", icon: "📊", suffix: "%" },
    { key: "inflation", label: "Inflation Rate", icon: "📉", suffix: "%" },
    { key: "retirementAge", label: "Retirement Age", icon: "🎯", suffix: "years" },
    { key: "lifeExpectancy", label: "Life Expectancy", icon: "❤️", suffix: "years" },
  ];

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div className="glass-card p-3 border-score-good/30 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-foreground">✨ <strong>Demo Mode:</strong> Enter your details and connect API for personalized FIRE analysis</p>
        </motion.div>
      )}

      {/* Input Form */}
      <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold font-display mb-6 flex items-center gap-2 text-foreground">
          <Flame className="w-5 h-5 text-destructive" /> FIRE Path Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <span>{f.icon}</span> {f.label}
              </label>
              <div className="relative">
                {f.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{f.prefix}</span>}
                <input
                  type="number"
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => handleChange(f.key, Number(e.target.value))}
                  className={`w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${f.prefix ? 'pl-7' : ''}`}
                />
                {f.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{f.suffix}</span>}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          onClick={handleAnalyze}
          disabled={processing}
          className="gradient-btn mt-6 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {processing ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>🧠 Analyzing...</motion.span>
          ) : (
            <>Calculate FIRE Path <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </motion.div>

      {/* FIRE Score + Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div className="glass-card p-6 flex flex-col items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <ScoreGauge score={data.fire_score} label="FIRE Score" size={130} />
        </motion.div>
        {[
          { icon: Target, label: "Corpus Needed", value: data.fire_corpus_required, prefix: "₹", color: "bg-primary/10 text-primary" },
          { icon: Calendar, label: "Years Left", value: data.years_remaining, suffix: " yrs", color: "bg-accent/10 text-accent" },
          { icon: IndianRupee, label: "Monthly SIP", value: data.monthly_sip_required, prefix: "₹", color: "bg-score-excellent/10 text-score-excellent" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-card p-6 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
          >
            <div className={`p-2 rounded-xl mb-2 ${m.color}`}>
              <m.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className="text-lg font-bold font-display text-foreground">
              <AnimatedCounter value={m.value} prefix={m.prefix || ""} suffix={m.suffix || ""} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Wealth Projection Chart */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Wealth Growth Projection
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.wealth_projection}>
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${(v / 10000000).toFixed(1)}Cr`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
              formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
            />
            <Legend />
            <Line type="monotone" dataKey="current_path" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} name="Current Path" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="required_path" stroke="hsl(225, 73%, 57%)" strokeWidth={2.5} dot={false} name="Required Path" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Monthly Roadmap */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">🗓️ Monthly SIP Roadmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left py-2">Month</th>
                <th className="text-right py-2">SIP Amount</th>
                <th className="text-right py-2">Equity</th>
                <th className="text-right py-2">Debt</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly_plan.map((p, i) => (
                <motion.tr key={i} className="border-b border-border/50" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <td className="py-2.5 text-foreground font-medium">Month {p.month}</td>
                  <td className="text-right text-foreground">₹{p.sip_amount.toLocaleString("en-IN")}</td>
                  <td className="text-right text-primary font-medium">{p.equity_ratio}%</td>
                  <td className="text-right text-muted-foreground">{p.debt_ratio}%</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-sm font-semibold font-display mb-3 text-foreground">💡 AI Recommendations</h3>
        <div className="grid gap-3">
          {data.recommendations.map((rec, i) => (
            <InsightCard key={i} type="tip" text={rec} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h3 className="text-sm font-semibold font-display mb-2 text-foreground">📋 Executive Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.executive_summary}</p>
      </motion.div>
    </div>
  );
};

export default FirePlanner;