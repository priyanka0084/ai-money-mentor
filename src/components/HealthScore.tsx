import { useState } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Heart, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import InsightCard from "./InsightCard";
import { demoHealthScoreData } from "@/lib/demoData";
import { analyzeHealthScore, getApiKey } from "@/lib/groq";

const HealthScore = () => {
  const [data, setData] = useState(demoHealthScoreData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    monthlyIncome: 100000,
    monthlyExpenses: 50000,
    emergencyFund: 200000,
    totalInvestments: 2700000,
    totalDebt: 500000,
    hasLifeInsurance: false,
    hasHealthInsurance: true,
    age: 30,
  });

  const handleAnalyze = async () => {
    if (!getApiKey()) { setIsDemo(true); return; }
    setProcessing(true);
    try {
      const result = await analyzeHealthScore(form);
      setData(JSON.parse(extractJSON(result)));
      setIsDemo(false);
    } catch {
      setIsDemo(true);
    } finally {
      setProcessing(false);
    }
  };

  const radarData = data.dimensions.map(d => ({
    dimension: d.name.split(" ")[0],
    score: d.score,
    fullMark: 100,
  }));

  const statusColor = (status: string) => {
    if (status === "Good") return "text-score-excellent bg-score-excellent/10";
    if (status === "Moderate") return "text-score-good bg-score-good/10";
    return "text-score-poor bg-score-poor/10";
  };

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div className="glass-card p-3 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-foreground">✨ <strong>Demo Mode:</strong> Enter your details for personalized health score</p>
        </motion.div>
      )}

      {/* Input Form */}
      <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold font-display mb-6 flex items-center gap-2 text-foreground">
          <Heart className="w-5 h-5 text-destructive" /> Financial Health Check
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "monthlyIncome", label: "Monthly Income", prefix: "₹" },
            { key: "monthlyExpenses", label: "Monthly Expenses", prefix: "₹" },
            { key: "emergencyFund", label: "Emergency Fund", prefix: "₹" },
            { key: "totalInvestments", label: "Total Investments", prefix: "₹" },
            { key: "totalDebt", label: "Total Debt", prefix: "₹" },
            { key: "age", label: "Age", suffix: "years" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
              <div className="relative">
                {f.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{f.prefix}</span>}
                <input
                  type="number"
                  value={form[f.key as keyof typeof form] as number}
                  onChange={(e) => setForm(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                  className={`w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${f.prefix ? 'pl-7' : ''}`}
                />
                {f.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{f.suffix}</span>}
              </div>
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Life Insurance</label>
            <button
              onClick={() => setForm(prev => ({ ...prev, hasLifeInsurance: !prev.hasLifeInsurance }))}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${form.hasLifeInsurance ? 'border-score-excellent/40 bg-score-excellent/10 text-score-excellent' : 'border-border bg-card text-muted-foreground'}`}
            >
              {form.hasLifeInsurance ? "✅ Yes" : "❌ No"}
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Health Insurance</label>
            <button
              onClick={() => setForm(prev => ({ ...prev, hasHealthInsurance: !prev.hasHealthInsurance }))}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${form.hasHealthInsurance ? 'border-score-excellent/40 bg-score-excellent/10 text-score-excellent' : 'border-border bg-card text-muted-foreground'}`}
            >
              {form.hasHealthInsurance ? "✅ Yes" : "❌ No"}
            </button>
          </div>
        </div>
        <motion.button
          onClick={handleAnalyze}
          disabled={processing}
          className="gradient-btn mt-6 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {processing ? "🧠 Analyzing..." : <>Check Health Score <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </motion.div>

      {/* Main Score + Radar */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-8 flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <ScoreGauge score={data.overall_score} label="Financial Health Score" size={160} />
          <p className="text-sm text-muted-foreground mt-4 text-center max-w-xs">{data.summary}</p>
        </motion.div>

        <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">📊 Health Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Dimension Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">📋 Detailed Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.dimensions.map((dim, i) => (
            <motion.div
              key={dim.name}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-foreground">{dim.name}</h4>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(dim.status)}`}>{dim.status}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: dim.score >= 70 ? "hsl(var(--score-excellent))" : dim.score >= 45 ? "hsl(var(--score-good))" : "hsl(var(--score-poor))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-2">{dim.insight}</p>
              <p className="text-xs text-primary font-medium">💡 {dim.recommendation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Risks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold font-display mb-3 text-foreground">⚠️ Top Risks</h3>
        <div className="grid gap-3">
          {data.top_risks.map((risk, i) => (
            <InsightCard key={i} type="warning" text={risk} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Action Plan */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">🎯 Action Plan</h3>
        <div className="space-y-3">
          {data.action_plan.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HealthScore;