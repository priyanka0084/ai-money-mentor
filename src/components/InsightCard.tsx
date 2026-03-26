import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Target } from "lucide-react";

interface InsightCardProps {
  type: "warning" | "tip" | "action" | "alert" | "info";
  text: string;
  impact?: number;
  index?: number;
}

const iconMap = {
  warning: AlertTriangle,
  alert: AlertTriangle,
  tip: Lightbulb,
  action: Target,
  info: Lightbulb,
};

const colorMap = {
  warning: "text-score-good border-score-good/20 bg-score-good/5",
  alert: "text-destructive border-destructive/20 bg-destructive/5",
  tip: "text-primary border-primary/20 bg-primary/5",
  action: "text-accent border-accent/20 bg-accent/5",
  info: "text-accent border-accent/20 bg-accent/5",
};

const InsightCard = ({ type, text, impact, index = 0 }: InsightCardProps) => {
  const Icon = iconMap[type] || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className={`flex items-start gap-3 p-3 rounded-lg border ${colorMap[type]} transition-all`}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{text}</p>
        {impact && impact > 0 && (
          <p className="text-xs mt-1 text-muted-foreground">
            Potential impact: <span className="font-semibold text-score-excellent">₹{impact.toLocaleString("en-IN")}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default InsightCard;
