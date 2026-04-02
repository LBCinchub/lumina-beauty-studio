import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, LogOut, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import StatsCards from "../components/admin/StatsCards";
import BookingRow from "../components/admin/BookingRow";

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const me = await base44.auth.me();
    setUser(me);
    await loadBookings();
  };

  const loadBookings = async () => {
    setLoading(true);
    const results = await base44.entities.Booking.list("-created_date", 100);
    setBookings(results);
    setLoading(false);
  };

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body">Access denied. Admins only.</p>
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.client_name?.toLowerCase().includes(q) ||
      b.client_email?.toLowerCase().includes(q) ||
      b.service?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-pink-400 rounded-xl">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">LBC Admin</h1>
              <p className="text-xs text-muted-foreground font-body">Lumina Beauty Consultant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadBookings} className="p-2 rounded-xl hover:bg-secondary transition-colors">
              <RefreshCw size={15} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => base44.auth.logout("/")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <StatsCards bookings={bookings} />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-card border border-border rounded-xl">
            <Search size={14} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/60 outline-none font-body"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium font-body border capitalize transition-all ${
                  filter === s
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground font-body">No bookings found</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-muted-foreground font-body mb-3">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.map((b) => (
              <BookingRow key={b.id} booking={b} onUpdate={loadBookings} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}