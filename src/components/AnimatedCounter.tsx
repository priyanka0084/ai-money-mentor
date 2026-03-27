import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 1.5, className = "", decimals = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const safeValue = Number(value ?? 0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = safeValue;
    const stepTime = (duration * 1000) / 60;
    const increment = end / 60;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const safeCount = Number(count ?? 0);

const formatted = decimals > 0
  ? safeCount.toFixed(decimals)
  : Math.floor(safeCount).toLocaleString("en-IN");

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
