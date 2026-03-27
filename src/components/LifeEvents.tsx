import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, ArrowRight } from "lucide-react";
import InsightCard from "./InsightCard";
import AnimatedCounter from "./AnimatedCounter";
import { demoLifeEventData } from "@/lib/demoData";
import { analyzeLifeEvent, getApiKey, extractJSON } from "@/lib/groq";

const EVENTS = ["Bonus", "Marriage", "New Baby", "Inheritance", "Job Switch"];
const RISK_PROFILES = ["Conservative", "Moderate", "Aggressive"];
const COLORS = ["hsl(225, 73%, 57%)", "hsl(142, 71%, 45%)", "hsl(187, 80%, 45%)", "hsl(48, 96%, 48%)", "hsl(280, 60%, 55%)"];

const LifeEvents = () => {
  const [data, setData] = useState(demoLifeEventData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    event: "Bonus",
    amount: 500000,
    currentIncome: 100000,
    riskProfile: "Moderate",
  });

  const handleAnalyze = async () => {
    if (!getApiKey()) { setIsDemo(true); return; }
    setProcessing(true);
    try {
      const result = await analyzeLifeEvent(form);
      setData(JSON.parse(extractJSON(result)));
      setIsDemo(false);
    } catch {
      setIsDemo(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div className="glass-card p-3 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-foreground">✨ <strong>Demo Mode:</strong> Select a life event for AI-powered financial advice</p>
        </motion.div>
      )}

      {/* Input */}
      <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold font-display mb-6 flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-primary" /> Life Event Advisor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Life Event</label>
            <select
              value={form.event}
              onChange={(e) => setForm(prev => ({ ...prev, event: e.target.value }))}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {EVENTS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Income (₹)</label>
            <input
              type="number"
              value={form.currentIncome}
              onChange={(e) => setForm(prev => ({ ...prev, currentIncome: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Risk Profile</label>
            <select
              value={form.riskProfile}
              onChange={(e) => setForm(prev => ({ ...prev, riskProfile: e.target.value }))}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {RISK_PROFILES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <motion.button
          onClick={handleAnalyze}
          disabled={processing}
          className="gradient-btn mt-6 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {processing ? "🧠 Analyzing..." : <>Get AI Advice <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </motion.div>

      {/* Impact + Strategy */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold font-display mb-3 text-foreground">💰 Financial Impact</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{data.financial_impact}</p>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Tax Impact</p>
            <p className="text-2xl font-bold font-display text-destructive">
              ₹<AnimatedCounter value={data.tax_impact} />
            </p>
          </div>
        </motion.div>

        <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold font-display mb-3 text-foreground">📊 Investment Strategy</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.investment_strategy}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="allocation"
                nameKey="instrument"
              >
                {data.investment_strategy.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                formatter={(v: number) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {data.investment_strategy.map((s, i) => (
              <span key={s.instrument} className="text-[10px] flex items-center gap-1 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {s.instrument} ({s.allocation}%)
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Adjustment */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold font-display mb-2 text-foreground">⚖️ Risk Adjustment</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.risk_adjustment}</p>
      </motion.div>

      {/* Mistakes to Avoid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold font-display mb-3 text-foreground">🚫 Mistakes to Avoid</h3>
        <div className="grid gap-3">
          {data.mistakes_to_avoid.map((m, i) => (
            <InsightCard key={i} type="warning" text={m} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Action Steps */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">✅ Immediate Actions</h3>
        <div className="space-y-3">
          {data.action_steps.map((step, i) => (
            <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <div className="w-6 h-6 rounded-full bg-score-excellent/10 text-score-excellent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
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

export default LifeEvents;