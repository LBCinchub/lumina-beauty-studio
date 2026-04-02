import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export default function StatsCards({ bookings }) {
  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <Icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-body">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}