import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronDown, MapPin, Phone, Mail, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function BookingRow({ booking, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status) => {
    setLoading(true);
    await base44.entities.Booking.update(booking.id, { status });
    onUpdate();
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mb-3">
      {/* Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground font-body">{booking.client_name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-body capitalize ${STATUS_STYLES[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-0.5 capitalize">
            {booking.service} · {booking.preferred_date} at {booking.preferred_time}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Client details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {booking.client_email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <Mail size={13} className="text-primary" />
                    {booking.client_email}
                  </div>
                )}
                {booking.client_phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <Phone size={13} className="text-primary" />
                    {booking.client_phone}
                  </div>
                )}
                {booking.client_address && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body col-span-full">
                    <MapPin size={13} className="text-primary flex-shrink-0" />
                    {booking.client_address}
                  </div>
                )}
                {booking.notes && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground font-body col-span-full">
                    <StickyNote size={13} className="text-primary flex-shrink-0 mt-0.5" />
                    {booking.notes}
                  </div>
                )}
              </div>

              {/* Look info */}
              {booking.look_name && (
                <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs font-body">
                  <p className="font-semibold text-foreground mb-0.5">Look: {booking.look_name}</p>
                  {booking.look_description && (
                    <p className="text-muted-foreground line-clamp-2">{booking.look_description}</p>
                  )}
                </div>
              )}

              {/* Payment badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-secondary border border-border text-muted-foreground font-body capitalize">
                  💳 {booking.payment_method || "N/A"}
                </span>
                <span className={`text-xs px-2 py-1 rounded-lg border font-body ${booking.deposit_paid ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"}`}>
                  {booking.deposit_paid ? "✓ Deposit Paid" : "⏳ Deposit Pending"}
                </span>
              </div>

              {/* Status controls */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground font-body mb-2 uppercase tracking-wide">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={loading || booking.status === s}
                      onClick={() => handleStatus(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-body capitalize transition-all disabled:opacity-40 ${
                        booking.status === s
                          ? `${STATUS_STYLES[s]} font-semibold`
                          : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}