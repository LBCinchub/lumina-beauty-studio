import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LookHistory({ bookings }) {
  const withLooks = bookings.filter((b) => b.look_name);

  if (withLooks.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground font-body">No saved looks yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {withLooks.map((booking, i) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden"
        >
          {booking.look_image ? (
            <img src={booking.look_image} alt={booking.look_name} className="w-full aspect-square object-cover" />
          ) : (
            <div className="w-full aspect-square bg-secondary flex items-center justify-center">
              <Sparkles size={24} className="text-muted-foreground opacity-40" />
            </div>
          )}
          <div className="p-3">
            <p className="text-sm font-display font-semibold text-foreground line-clamp-1">{booking.look_name}</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5 capitalize">{booking.service}</p>
            <p className="text-xs text-muted-foreground/60 font-body mt-1">
              {new Date(booking.created_date).toLocaleDateString("en-CA")}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}