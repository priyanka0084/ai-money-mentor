import { motion } from "framer-motion";

interface AgentPipelineProps {
  activeStep: number;
  steps?: string[];
}

const defaultSteps = [
  { icon: "📄", label: "Upload" },
  { icon: "🧠", label: "AI Analysis" },
  { icon: "📊", label: "Data Extract" },
  { icon: "💡", label: "Insights" },
  { icon: "📈", label: "Strategy" },
];

const AgentPipeline = ({ activeStep, steps }: AgentPipelineProps) => {
  const pipelineSteps = steps
    ? steps.map((s, i) => ({ icon: defaultSteps[i]?.icon || "⚙️", label: s }))
    : defaultSteps;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {pipelineSteps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              i <= activeStep
                ? "glass-card glow-primary"
                : "glass-card opacity-40"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: i === activeStep ? 1.1 : 1,
              opacity: i <= activeStep ? 1 : 0.4,
            }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <motion.span
              className="text-xl"
              animate={i === activeStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {step.icon}
            </motion.span>
            <span className="text-[10px] font-medium text-muted-foreground">{step.label}</span>
          </motion.div>
          {i < pipelineSteps.length - 1 && (
            <motion.div
              className={`h-0.5 w-6 rounded ${i < activeStep ? "bg-primary" : "bg-border"}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.15 + 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AgentPipeline;