import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, CheckCircle2, XCircle, Save, Trash2 } from "lucide-react";
import { getApiKey, setApiKey, removeApiKey } from "@/lib/groq";

const Settings = () => {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setKey(stored);
      setStatus("connected");
    }
  }, []);

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setStatus("connected");
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setKey("");
    setStatus("disconnected");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold font-display mb-2 text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your AI connection for live analysis.</p>
      </motion.div>

      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Key className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Groq API Key</h3>
            <p className="text-xs text-muted-foreground">Used for LLaMA 3.3 70B analysis</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {status === "connected" ? (
              <span className="flex items-center gap-1 text-xs text-score-excellent">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <XCircle className="w-3.5 h-3.5" /> Not Connected
              </span>
            )}
          </div>
        </div>

        <div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleSave}
            className="gradient-btn px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" /> Save Key
          </motion.button>
          {status === "connected" && (
            <motion.button
              onClick={handleRemove}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" /> Remove
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-sm mb-3 text-foreground">About AI Money Mentor Pro</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          AI Money Mentor Pro uses advanced AI models to analyze your financial documents and provide actionable insights.
          Upload tax documents or portfolio statements to get personalized recommendations for tax savings,
          portfolio optimization, and wealth growth strategies.
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Your data is processed securely and never stored on any server. Analysis happens in real-time through the Groq API.
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;