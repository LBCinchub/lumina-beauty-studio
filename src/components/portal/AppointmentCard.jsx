import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Scissors, X, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  pending: { label: "Pending Confirmation", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", icon: CheckCircle },
  completed: { label: "Completed", color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bg: "bg-secondary border-border", icon: X },
};

const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function AppointmentCard({ booking, onUpdate }) {
  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(booking.preferred_date || "");
  const [newTime, setNewTime] = useState(booking.preferred_time || "");
  const [loading, setLoading] = useState(false);

  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const canModify = booking.status === "pending" || booking.status === "confirmed";

  const handleReschedule = async () => {
    setLoading(true);
    await base44.entities.Booking.update(booking.id, {
      preferred_date: newDate,
      preferred_time: newTime,
      status: "pending",
    });
    setRescheduling(false);
    setLoading(false);
    onUpdate();
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setLoading(true);
    await base44.entities.Booking.update(booking.id, { status: "cancelled" });
    setLoading(false);
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden"
    >
      {/* Top bar */}
      <div className={`flex items-center gap-2 px-5 py-3 border-b ${status.bg}`}>
        <StatusIcon size={14} className={status.color} />
        <span className={`text-xs font-semibold font-body ${status.color}`}>{status.label}</span>
        <span className="ml-auto text-xs text-muted-foreground font-body">
          Booked {new Date(booking.created_date).toLocaleDateString("en-CA")}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Look name & service */}
        <div className="flex items-start gap-3">
          {booking.look_image && (
            <img src={booking.look_image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-border" />
          )}
          <div>
            <h3 className="text-base font-display font-semibold text-foreground">
              {booking.look_name || "Custom Look"}
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5 capitalize">{booking.service}</p>
            {booking.look_description && (
              <p className="text-xs text-muted-foreground/70 font-body mt-1 line-clamp-2">{booking.look_description}</p>
            )}
          </div>
        </div>

        {/* Date & Time */}
        {!rescheduling ? (
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <span className="text-sm text-foreground font-body">
                {booking.preferred_date || "Date TBD"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span className="text-sm text-foreground font-body">
                {booking.preferred_time || "Time TBD"}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs font-semibold text-foreground font-body">Select a new date & time</p>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body outline-none focus:border-primary/60"
            />
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setNewTime(t)}
                  className={`py-1.5 rounded-lg text-xs font-body border transition-all ${
                    newTime === t ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setRescheduling(false)}
                className="flex-1 py-2 border border-border rounded-xl text-sm font-body text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={!newDate || !newTime || loading}
                className="flex-[2] py-2 bg-foreground text-background rounded-xl text-sm font-bold font-body disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {canModify && !rescheduling && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setRescheduling(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
            >
              <RefreshCw size={13} />
              Reschedule
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/30 text-sm font-body text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <><X size={13} /> Cancel</>}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}