import { motion } from "framer-motion";
import { Star, Gift, Zap, Crown } from "lucide-react";

const TIERS = [
  { name: "Bronze", min: 0, max: 199, icon: Star, color: "text-amber-600", bg: "from-amber-600/20 to-amber-800/10", border: "border-amber-600/30", discount: 5 },
  { name: "Silver", min: 200, max: 499, icon: Zap, color: "text-slate-300", bg: "from-slate-400/20 to-slate-600/10", border: "border-slate-400/30", discount: 10 },
  { name: "Gold", min: 500, max: 999, icon: Crown, color: "text-yellow-400", bg: "from-yellow-400/20 to-yellow-600/10", border: "border-yellow-400/30", discount: 15 },
  { name: "Platinum", min: 1000, max: Infinity, icon: Gift, color: "text-primary", bg: "from-primary/20 to-pink-500/10", border: "border-primary/30", discount: 20 },
];

// Points per booking: completed = 15pts, others = 10pts
export function calculateLoyaltyPoints(bookings) {
  return bookings.reduce((sum, b) => {
    if (b.status === "cancelled") return sum;
    return sum + (b.status === "completed" ? 15 : 10);
  }, 0);
}

export default function LoyaltyCard({ bookings }) {
  const points = calculateLoyaltyPoints(bookings);
  const tier = TIERS.find((t) => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const TierIcon = tier.icon;

  const progressPercent = nextTier
    ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-gradient-to-br ${tier.bg} border ${tier.border} p-5 mb-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-background/30 border ${tier.border}`}>
            <TierIcon size={18} className={tier.color} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Loyalty Tier</p>
            <p className={`text-lg font-display font-bold ${tier.color}`}>{tier.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-body">Balance</p>
          <p className="text-2xl font-display font-bold text-foreground">{points} <span className="text-sm font-body text-muted-foreground">pts</span></p>
        </div>
      </div>

      {/* Progress bar */}
      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground font-body mb-1.5">
            <span>{tier.name}</span>
            <span>{nextTier.min - points} pts to {nextTier.name}</span>
          </div>
          <div className="h-2 rounded-full bg-background/40 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${tier.color.replace("text-", "from-")} to-pink-400`}
              style={{ background: `hsl(var(--primary))`, opacity: 0.8 }}
            />
          </div>
        </div>
      )}

      {/* Perk */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-background/30">
        <Gift size={13} className={tier.color} />
        <p className="text-xs text-foreground font-body">
          <span className="font-semibold">{tier.discount}% off</span> your next service · {tier.name} perk
        </p>
        {nextTier && (
          <span className="ml-auto text-xs text-muted-foreground font-body">
            {nextTier.discount}% at {nextTier.name}
          </span>
        )}
      </div>

      {/* How to earn */}
      <p className="text-xs text-muted-foreground font-body mt-3 text-center">
        Earn <span className="text-foreground font-medium">10 pts</span> per booking · <span className="text-foreground font-medium">15 pts</span> when completed
      </p>
    </motion.div>
  );
}