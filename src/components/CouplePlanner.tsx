import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Heart, ArrowRight, Users } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import InsightCard from "./InsightCard";
import { demoCoupleData } from "@/lib/demoData";
import { analyzeCouplePlan, getApiKey } from "@/lib/groq";

const CouplePlanner = () => {
  const [data, setData] = useState(demoCoupleData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    partnerAIncome: 150000,
    partnerATaxRegime: "New",
    partnerAInvestments: 3000000,
    partnerBIncome: 100000,
    partnerBTaxRegime: "Old",
    partnerBInvestments: 2000000,
  });

  const handleAnalyze = async () => {
    if (!getApiKey()) { setIsDemo(true); return; }
    setProcessing(true);
    try {
      const result = await analyzeCouplePlan(form);
      setData(JSON.parse(result));
      setIsDemo(false);
    } catch {
      setIsDemo(true);
    } finally {
      setProcessing(false);
    }
  };

  const investmentChartData = data.investment_split.map(s => ({
    name: `Partner ${s.partner}`,
    amount: s.amount,
  }));

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div className="glass-card p-3 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-foreground">✨ <strong>Demo Mode:</strong> Enter both partners' details for optimized joint planning</p>
        </motion.div>
      )}

      {/* Input Form */}
      <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold font-display mb-6 flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-primary" /> Couple's Money Planner
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Partner A */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">A</div>
              <h3 className="font-semibold text-sm text-foreground">Partner A</h3>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Income (₹)</label>
              <input type="number" value={form.partnerAIncome} onChange={(e) => setForm(prev => ({ ...prev, partnerAIncome: Number(e.target.value) }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tax Regime</label>
              <select value={form.partnerATaxRegime} onChange={(e) => setForm(prev => ({ ...prev, partnerATaxRegime: e.target.value }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Old</option><option>New</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Total Investments (₹)</label>
              <input type="number" value={form.partnerAInvestments} onChange={(e) => setForm(prev => ({ ...prev, partnerAInvestments: Number(e.target.value) }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          {/* Partner B */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">B</div>
              <h3 className="font-semibold text-sm text-foreground">Partner B</h3>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Income (₹)</label>
              <input type="number" value={form.partnerBIncome} onChange={(e) => setForm(prev => ({ ...prev, partnerBIncome: Number(e.target.value) }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tax Regime</label>
              <select value={form.partnerBTaxRegime} onChange={(e) => setForm(prev => ({ ...prev, partnerBTaxRegime: e.target.value }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Old</option><option>New</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Total Investments (₹)</label>
              <input type="number" value={form.partnerBInvestments} onChange={(e) => setForm(prev => ({ ...prev, partnerBInvestments: Number(e.target.value) }))} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        </div>
        <motion.button
          onClick={handleAnalyze}
          disabled={processing}
          className="gradient-btn mt-6 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {processing ? "🧠 Analyzing..." : <>Optimize Together <Heart className="w-4 h-4" /></>}
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Combined Income", value: data.combined_income, prefix: "₹", color: "bg-primary/10 text-primary" },
          { label: "Net Worth", value: data.combined_net_worth, prefix: "₹", color: "bg-score-excellent/10 text-score-excellent" },
          { label: "Tax Savings", value: data.tax_savings, prefix: "₹", color: "bg-accent/10 text-accent" },
          { label: "Insurance Gap", value: data.insurance_gap, prefix: "₹", color: "bg-score-poor/10 text-score-poor" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-card p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ scale: 1.03, y: -2 }}
          >
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-lg font-bold font-display text-foreground">
              <AnimatedCounter value={m.value} prefix={m.prefix} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Optimization Strategy */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-semibold font-display mb-3 text-foreground">💡 Tax Optimization Strategy</h3>
        <div className="grid gap-3">
          {data.optimization_strategy.map((s, i) => (
            <InsightCard key={i} type="tip" text={s} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Investment Split */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">📊 Investment Split Plan</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={investmentChartData} layout="vertical">
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}/month`]} />
            <Bar dataKey="amount" fill="url(#coupleGrad)" radius={[0, 8, 8, 0]} barSize={20} />
            <defs>
              <linearGradient id="coupleGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(225, 73%, 57%)" />
                <stop offset="100%" stopColor="hsl(245, 58%, 51%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.investment_split.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.partner === 'A' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>{s.partner}</div>
              <span className="text-foreground font-medium">₹{s.amount.toLocaleString("en-IN")}/month</span>
              <span className="text-muted-foreground text-xs">→ {s.instruments}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Joint Goals */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">🎯 Joint Goals</h3>
        <div className="space-y-3">
          {data.joint_goals.map((goal, i) => (
            <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <div className="w-6 h-6 rounded-full bg-score-good/10 text-score-good flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-foreground">{goal}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Plan */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">✅ Action Plan</h3>
        <div className="space-y-3">
          {data.action_plan.map((step, i) => (
            <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h3 className="text-sm font-semibold font-display mb-2 text-foreground">📋 Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
      </motion.div>
    </div>
  );
};

export default CouplePlanner;