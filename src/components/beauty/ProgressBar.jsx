import { motion } from "framer-motion";

export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < currentStep
              ? "w-12 bg-gradient-to-r from-primary to-pink-400"
              : i === currentStep
              ? "w-12 bg-gradient-to-r from-primary to-pink-400"
              : "w-8 bg-secondary"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
      <span className="ml-3 text-xs text-muted-foreground font-body font-medium tracking-widest uppercase">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}