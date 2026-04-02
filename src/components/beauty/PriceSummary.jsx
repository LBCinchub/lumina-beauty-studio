import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Info } from "lucide-react";
import { calculatePrice } from "../../utils/pricing";

export default function PriceSummary({ service, intensity, styles = [], showDeposit = false }) {
  const pricing = calculatePrice(service, intensity, styles);

  if (!pricing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="rounded-2xl bg-gradient-to-br from-primary/10 to-pink-500/5 border border-primary/20 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground font-body tracking-wide uppercase">
            Estimated Price
          </span>
          <span className="ml-auto text-xs text-muted-foreground font-body">Ottawa, ON · CAD</span>
        </div>

        <div className="space-y-1.5 mb-3">
          {pricing.breakdown.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-body">{item.label}</span>
              <span className="text-xs font-medium text-foreground font-body">${item.price}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-primary/20 pt-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-foreground font-body">Estimated Total</span>
            {showDeposit && (
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                $20 deposit required to book
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-primary">${pricing.total}</span>
            <span className="text-xs text-muted-foreground font-body ml-1">CAD</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-border/50">
          <Info size={11} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            Final price confirmed at consultation. Prices may vary based on nail length, skin condition, and lash type.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}