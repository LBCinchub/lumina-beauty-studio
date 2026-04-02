import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, History, LogOut, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AppointmentCard from "../components/portal/AppointmentCard";
import LookHistory from "../components/portal/LookHistory";

const TABS = [
  { id: "upcoming", label: "Appointments", icon: Calendar },
  { id: "history", label: "Look History", icon: History },
];

export default function ClientPortal() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const me = await base44.auth.me();
    setUser(me);
    await loadBookings(me.email);
    setLoading(false);
  };

  const loadBookings = async (email) => {
    const results = await base44.entities.Booking.filter({ client_email: email }, "-created_date");
    setBookings(results);
  };

  const upcoming = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");
  const past = bookings;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/e8937607d_generated_image.png')" }}
        />
        <div className="fixed inset-0 bg-black/70" />
        <Loader2 className="animate-spin text-primary relative" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/e8937607d_generated_image.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative max-w-xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-400 rounded-xl blur-lg opacity-50" />
              <div className="relative p-2.5 bg-gradient-to-br from-primary to-pink-400 rounded-xl">
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">My Portal</h1>
              <p className="text-xs text-muted-foreground font-body">{user?.full_name || user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => base44.auth.logout("/")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Bookings", value: bookings.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Looks Saved", value: bookings.filter((b) => b.look_name).length },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 border border-border rounded-xl p-1 mb-6">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold font-body transition-all ${
                  tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {tab === "upcoming" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="text-center py-16 bg-card/40 border border-border rounded-2xl">
                <Calendar size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground font-body">No upcoming appointments</p>
                <a href="/" className="mt-4 inline-block text-xs text-primary font-body font-medium hover:underline">
                  Book your first look →
                </a>
              </div>
            ) : (
              upcoming.map((b) => (
                <AppointmentCard key={b.id} booking={b} onUpdate={() => loadBookings(user.email)} />
              ))
            )}
          </motion.div>
        )}

        {tab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LookHistory bookings={past} />
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <a href="/" className="text-xs text-muted-foreground/50 font-body hover:text-muted-foreground transition-colors">
            ← Back to Lumina AI
          </a>
        </div>
      </div>
    </div>
  );
}