import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ScoreGauge from "./ScoreGauge";
import InsightCard from "./InsightCard";
import AnimatedCounter from "./AnimatedCounter";
import FileUpload from "./FileUpload";
import AgentPipeline from "./AgentPipeline";
import { demoTaxData } from "@/lib/demoData";
import { analyzeTaxDocument, getApiKey } from "@/lib/groq";
import { ArrowRight } from "lucide-react";

const TaxWizard = () => {
  const [data, setData] = useState(demoTaxData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [agentStep, setAgentStep] = useState(-1);

  const handleFileContent = async (text: string) => {
    if (!getApiKey()) {
      setIsDemo(true);
      return;
    }
    setProcessing(true);
    setAgentStep(0);
    try {
      const intervals = [0, 1, 2, 3, 4].map((step) =>
        setTimeout(() => setAgentStep(step), step * 1500)
      );
      const result = await analyzeTaxDocument(text);
      intervals.forEach(clearTimeout);
      setAgentStep(4);
      const parsed = JSON.parse(extractJSON(result));
      setData(parsed);
      setIsDemo(false);
    } catch {
      setIsDemo(true);
    } finally {
      setProcessing(false);
    }
  };

  const deductions = [
    { name: "80C", used: data.deductions.section80C.used, limit: data.deductions.section80C.limit },
    { name: "80D", used: data.deductions.section80D.used, limit: data.deductions.section80D.limit },
    { name: "80CCD", used: data.deductions.section80CCD.used, limit: data.deductions.section80CCD.limit },
    { name: "HRA", used: data.deductions.hra.used, limit: data.deductions.hra.limit },
  ];

  const compareData = [
    { regime: "Old Regime", tax: data.taxOldRegime },
    { regime: "New Regime", tax: data.taxNewRegime },
  ];

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div
          className="glass-card p-3 border-score-good/30 bg-score-good/5 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm">✨ <strong>Demo Mode:</strong> Showing AI-generated sample insights</p>
        </motion.div>
      )}

      {/* Upload + Pipeline */}
      <div className="grid md:grid-cols-2 gap-6">
        <FileUpload onFileContent={handleFileContent} isProcessing={processing} />
        <div className="glass-card p-6 flex items-center">
          <AgentPipeline activeStep={agentStep} />
        </div>
      </div>

      {/* Score + Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          className="glass-card p-6 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ScoreGauge score={data.taxIntelligenceScore} label="Tax Intelligence Score" size={140} />
        </motion.div>

        <motion.div
          className="glass-card p-6 md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold font-display mb-4">Tax Comparison</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={compareData}>
              <XAxis dataKey="regime" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Tax"]}
              />
              <Bar dataKey="tax" radius={[6, 6, 0, 0]} fill="url(#taxGrad)" />
              <defs>
                <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(225, 73%, 57%)" />
                  <stop offset="100%" stopColor="hsl(245, 58%, 51%)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm mt-2 text-muted-foreground">
            Recommended: <span className="font-semibold text-accent">{data.recommendedRegime} Regime</span>
            {" "} — Save <span className="text-score-excellent font-bold">₹<AnimatedCounter value={data.savings} /></span>
          </p>
        </motion.div>
      </div>

      {/* Deduction Utilization */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold font-display mb-4">Deduction Utilization</h3>
        <div className="space-y-4">
          {deductions.map((d, i) => {
            const pct = Math.min((d.used / d.limit) * 100, 100);
            const gap = d.limit - d.used;
            return (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>Section {d.name}</span>
                  <span className="text-muted-foreground">
                    ₹{d.used.toLocaleString("en-IN")} / ₹{d.limit.toLocaleString("en-IN")}
                    {gap > 0 && <span className="text-score-good ml-2">Gap: ₹{gap.toLocaleString("en-IN")}</span>}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: pct >= 80 ? "hsl(var(--score-excellent))" : pct >= 50 ? "hsl(var(--score-good))" : "hsl(var(--score-poor))" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Smart Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-semibold font-display mb-3">🔍 Smart Insights</h3>
        <div className="grid gap-3">
          {data.insights.map((insight, i) => (
            <InsightCard key={i} type={insight.type} text={insight.text} impact={insight.impact} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-semibold font-display mb-3">🎯 Personalized Strategies</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {data.strategies.map((s, i) => (
            <motion.div
              key={i}
              className="glass-card p-4 flex items-center justify-between"
              whileHover={{ scale: 1.02, x: 4 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Save <span className="text-score-excellent font-semibold">₹{s.savings.toLocaleString("en-IN")}</span>
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                s.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-score-good/10 text-score-good"
              }`}>
                {s.priority}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TaxWizard;
