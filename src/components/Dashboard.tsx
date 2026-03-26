import { motion } from "framer-motion";
import { TrendingUp, Shield, Brain, Zap } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AnimatedCounter from "./AnimatedCounter";
import InsightCard from "./InsightCard";
import AgentPipeline from "./AgentPipeline";
import { dashboardInsights, demoTaxData, demoPortfolioData } from "@/lib/demoData";

const allocationData = Object.entries(demoPortfolioData.allocation).map(([name, value]) => ({ name, value }));
const COLORS = ["hsl(225, 73%, 57%)", "hsl(187, 80%, 45%)", "hsl(142, 71%, 45%)", "hsl(48, 96%, 48%)", "hsl(280, 60%, 55%)", "hsl(0, 72%, 60%)"];

const taxCompare = [
  { regime: "Old", tax: demoTaxData.taxOldRegime },
  { regime: "New", tax: demoTaxData.taxNewRegime },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 md:p-12"
        style={{ background: "var(--gradient-hero)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating blur shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 right-40 w-24 h-24 rounded-full bg-score-good/10 blur-3xl" />

        <div className="relative z-10">
          <motion.h1
            className="text-3xl md:text-5xl font-bold font-display gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your AI Financial Brain
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Analyze. Optimize. Grow.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: TrendingUp, label: "Portfolio", value: "₹24.5L", color: "bg-primary/10 text-primary" },
              { icon: Shield, label: "Tax Saved", value: "₹38.5K", color: "bg-score-excellent/10 text-score-excellent" },
              { icon: Brain, label: "AI Score", value: "62/100", color: "bg-accent/10 text-accent" },
              { icon: Zap, label: "Insights", value: "8 New", color: "bg-score-good/10 text-score-good" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card px-5 py-3 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold font-display text-sm text-foreground">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Smart Insight Alerts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold font-display mb-4 flex items-center gap-2 text-foreground">
          <Brain className="w-5 h-5 text-primary" />
          AI-Powered Alerts
        </h2>
        <div className="grid gap-3">
          {dashboardInsights.map((insight, i) => (
            <InsightCard key={i} type={insight.type as any} text={insight.text} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Tax Comparison</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={taxCompare}>
              <XAxis dataKey="regime" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Tax"]}
              />
              <Bar dataKey="tax" radius={[8, 8, 0, 0]} fill="url(#barGradient)" />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(225, 73%, 57%)" />
                  <stop offset="100%" stopColor="hsl(245, 58%, 51%)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            Save <span className="text-score-excellent font-semibold">₹<AnimatedCounter value={demoTaxData.savings} /></span> with {demoTaxData.recommendedRegime} Regime
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {allocationData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                formatter={(v: number) => [`${v}%`, "Allocation"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {allocationData.map((d, i) => (
              <span key={d.name} className="text-[10px] flex items-center gap-1 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent Pipeline */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">🤖 AI Agent Pipeline</h3>
        <AgentPipeline activeStep={4} />
      </motion.div>
    </div>
  );
};

export default Dashboard;