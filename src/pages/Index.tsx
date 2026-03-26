import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calculator, BarChart3, Settings2, Flame, Heart, Sparkles, Users } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import TaxWizard from "@/components/TaxWizard";
import PortfolioXRay from "@/components/PortfolioXRay";
import FirePlanner from "@/components/FirePlanner";
import HealthScore from "@/components/HealthScore";
import LifeEvents from "@/components/LifeEvents";
import CouplePlanner from "@/components/CouplePlanner";
import Settings from "@/components/Settings";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tax", label: "Tax Wizard", icon: Calculator },
  { id: "portfolio", label: "Portfolio", icon: BarChart3 },
  { id: "fire", label: "FIRE", icon: Flame },
  { id: "health", label: "Health", icon: Heart },
  { id: "events", label: "Events", icon: Sparkles },
  { id: "couple", label: "Couple", icon: Users },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xl">💸</span>
            <h1 className="text-lg font-bold font-display gradient-text">Money Mentor Pro</h1>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--gradient-primary)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50">
        <div className="flex justify-around py-1.5 px-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""}`} />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
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
            {activeTab === "fire" && <FirePlanner />}
            {activeTab === "health" && <HealthScore />}
            {activeTab === "events" && <LifeEvents />}
            {activeTab === "couple" && <CouplePlanner />}
            {activeTab === "settings" && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;