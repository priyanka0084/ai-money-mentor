import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis
} from "recharts";
import ScoreGauge from "./ScoreGauge";
import InsightCard from "./InsightCard";
import FileUpload from "./FileUpload";
import AgentPipeline from "./AgentPipeline";
import { demoPortfolioData } from "@/lib/demoData";
import { analyzePortfolio, getApiKey } from "@/lib/groq";
import AnimatedCounter from "./AnimatedCounter";

const COLORS = ["hsl(225, 73%, 57%)", "hsl(187, 92%, 55%)", "hsl(142, 71%, 45%)", "hsl(48, 96%, 53%)", "hsl(280, 67%, 60%)", "hsl(0, 72%, 51%)"];

const PortfolioXRay = () => {
  const [data, setData] = useState(demoPortfolioData);
  const [isDemo, setIsDemo] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [agentStep, setAgentStep] = useState(-1);

  const handleFileContent = async (text: string) => {
    if (!getApiKey()) { setIsDemo(true); return; }
    setProcessing(true);
    setAgentStep(0);
    try {
      const intervals = [0, 1, 2, 3, 4].map(s => setTimeout(() => setAgentStep(s), s * 1500));
      const result = await analyzePortfolio(text);
      intervals.forEach(clearTimeout);
      setAgentStep(4);
      setData(JSON.parse(result));
      setIsDemo(false);
    } catch { setIsDemo(true); }
    finally { setProcessing(false); }
  };

  const allocData = Object.entries(data.allocation).map(([name, value]) => ({ name, value }));
  const radarData = Object.entries(data.riskRadar).map(([key, val]) => ({
    metric: key.charAt(0).toUpperCase() + key.slice(1),
    value: val,
    fullMark: 100,
  }));

  const rebalanceCompare = Object.keys(data.rebalanced).map(cat => ({
    category: cat,
    current: data.allocation[cat as keyof typeof data.allocation] || 0,
    suggested: data.rebalanced[cat as keyof typeof data.rebalanced],
  }));

  return (
    <div className="space-y-6">
      {isDemo && (
        <motion.div className="glass-card p-3 border-score-good/30 bg-score-good/5 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm">✨ <strong>Demo Mode:</strong> Showing AI-generated sample portfolio analysis</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <FileUpload onFileContent={handleFileContent} isProcessing={processing} />
        <div className="glass-card p-6 flex items-center">
          <AgentPipeline activeStep={agentStep} />
        </div>
      </div>

      {/* Score + Returns */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div className="glass-card p-6 flex flex-col items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <ScoreGauge score={data.healthScore} label="Portfolio Health" size={130} />
        </motion.div>
        {[
          { label: "Total Value", value: data.totalValue, prefix: "₹", suffix: "" },
          { label: "1Y Return", value: data.returns.oneYear, prefix: "", suffix: "%" },
          { label: "3Y Return", value: data.returns.threeYear, prefix: "", suffix: "%" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-card p-6 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className="text-xl font-bold font-display">
              <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.suffix === "%" ? 1 : 0} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Allocation + Risk Radar */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold font-display mb-4">Current Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {allocData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {allocData.map((d, i) => (
              <span key={d.name} className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-semibold font-display mb-4">⚠️ Risk Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fund Table */}
      <motion.div className="glass-card p-6 overflow-x-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold font-display mb-4">Fund Details</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left py-2">Fund</th>
              <th className="text-right py-2">Value</th>
              <th className="text-right py-2">Alloc</th>
              <th className="text-right py-2">ER</th>
              <th className="text-right py-2">1Y</th>
            </tr>
          </thead>
          <tbody>
            {data.funds.map((f, i) => (
              <motion.tr
                key={f.name}
                className="border-b border-border/50 hover:bg-muted/30"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <td className="py-2.5">
                  <p className="font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.category}</p>
                </td>
                <td className="text-right">₹{f.value.toLocaleString("en-IN")}</td>
                <td className="text-right">{f.allocation}%</td>
                <td className={`text-right ${f.expenseRatio > 1.5 ? "text-destructive" : ""}`}>{f.expenseRatio}%</td>
                <td className="text-right text-score-excellent">{f.returns1Y}%</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-sm font-semibold font-display mb-3">🔥 Smart Insights</h3>
        <div className="grid gap-3">
          {data.insights.map((ins, i) => (
            <InsightCard key={i} type={ins.type} text={ins.text} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Rebalancing */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h3 className="text-sm font-semibold font-display mb-4">🔄 Rebalancing Simulator</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rebalanceCompare} layout="vertical">
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`${v}%`]} />
            <Bar dataKey="current" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} name="Current" barSize={10} />
            <Bar dataKey="suggested" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Suggested" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-muted-foreground" /> Current</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-primary" /> Suggested</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PortfolioXRay;
