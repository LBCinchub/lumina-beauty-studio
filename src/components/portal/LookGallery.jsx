import { useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export default function LookGallery({ bookings, onRebook }) {
  const scrollRef = useRef(null);
  const withLooks = bookings.filter((b) => b.look_name);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  if (withLooks.length === 0) {
    return (
      <div className="text-center py-16 bg-card/40 border border-border rounded-2xl">
        <Sparkles size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground font-body">No looks saved yet</p>
        <p className="text-xs text-muted-foreground/60 font-body mt-1">Complete a booking to see your look gallery</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-body">{withLooks.length} look{withLooks.length !== 1 ? "s" : ""} saved</p>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {withLooks.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-64 snap-start bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden"
          >
            {booking.look_image ? (
              <div className="relative group">
                <img
                  src={booking.look_image}
                  alt={booking.look_name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-body font-medium">View Details</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-secondary flex items-center justify-center">
                <Sparkles size={28} className="text-muted-foreground opacity-40" />
              </div>
            )}

            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-display font-semibold text-foreground line-clamp-1">{booking.look_name}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5 capitalize">
                  {booking.service}
                  {booking.mood ? ` · ${booking.mood}` : ""}
                  {booking.intensity ? ` · ${booking.intensity}` : ""}
                </p>
                <p className="text-xs text-muted-foreground/50 font-body mt-1">
                  {new Date(booking.created_date).toLocaleDateString("en-CA")}
                </p>
              </div>

              {booking.look_description && (
                <p className="text-xs text-muted-foreground/70 font-body line-clamp-2">{booking.look_description}</p>
              )}

              <button
                onClick={() => onRebook(booking)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold font-body hover:bg-primary/20 transition-all"
              >
                <RefreshCw size={12} />
                Rebook this Look
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}