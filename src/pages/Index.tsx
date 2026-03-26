import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calculator, BarChart3, Settings2 } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import TaxWizard from "@/components/TaxWizard";
import PortfolioXRay from "@/components/PortfolioXRay";
import Settings from "@/components/Settings";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tax", label: "Tax Wizard", icon: Calculator },
  { id: "portfolio", label: "Portfolio X-Ray", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xl">💸</span>
            <h1 className="text-lg font-bold font-display gradient-text">Money Mentor Pro</h1>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--gradient-primary)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 rounded-none">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "tax" && <TaxWizard />}
            {activeTab === "portfolio" && <PortfolioXRay />}
            {activeTab === "settings" && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
