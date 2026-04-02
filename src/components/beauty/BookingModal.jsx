import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Calendar, User, Mail, Phone, MapPin, Sparkles, CheckCircle, Home } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── CONFIGURE YOUR DETAILS HERE ──────────────────────────────
const SALON_INFO = {
  name: "LBC Beauty — Mobile Service",
  phone: "(263) 566-0785",
  solana_wallet: "2SYh5UjyGEVwCMTQrY5LJrGRfEAmU9MqXECRrAMsNK34",
  etransfer_email: "pay@lbcbeauty.com",
  deposit_amount: 20,
  service_area: "Ottawa & Gatineau",
};
// ─────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

export default function BookingModal({ isOpen, onClose, result, data }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", date: "", time: "" });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormValid = form.name && form.email && form.address && form.date && form.time && paymentMethod;

  const handleSubmit = async () => {
    setLoading(true);
    await base44.entities.Booking.create({
      client_name: form.name,
      client_email: form.email,
      client_phone: form.phone,
      client_address: form.address,
      preferred_date: form.date,
      preferred_time: form.time,
      service: data.service,
      look_name: result?.look_name,
      look_description: result?.description,
      occasion: data.occasion,
      mood: data.mood,
      intensity: data.intensity,
      payment_method: paymentMethod,
      deposit_paid: false,
      status: "pending",
      notes: data.notes,
    });
    setLoading(false);
    setSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between z-10">
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">Book Your In-Home Appointment</h2>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                We come to you ✨ — ${SALON_INFO.deposit_amount} deposit to secure your spot
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Booking Saved! 🎉</h3>
              <p className="text-sm text-muted-foreground font-body mb-6">
                We received your booking request for <span className="text-foreground font-medium">{result?.look_name}</span>. 
                Please complete your ${SALON_INFO.deposit_amount} deposit to confirm.
              </p>
              <div className="bg-secondary/60 rounded-xl p-4 text-left mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-foreground font-body">{SALON_INFO.name}</span>
                </div>
                <p className="text-xs text-muted-foreground font-body">📍 {form.address}</p>
                <p className="text-xs text-muted-foreground font-body">📞 {SALON_INFO.phone}</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-body">
                    📅 {form.date} at {form.time}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-foreground text-background font-bold font-body rounded-xl hover:opacity-90 transition-all">
                Done
              </button>
            </motion.div>
          ) : (
            <div className="p-5 space-y-6">
              {/* Look Summary */}
              <div className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="w-2 h-full min-h-[2rem] rounded-full bg-gradient-to-b from-primary to-pink-400" />
                <div>
                  <p className="text-xs text-muted-foreground font-body">Selected Look</p>
                  <p className="text-sm font-semibold text-foreground font-body">{result?.look_name}</p>
                  <p className="text-xs text-primary font-body capitalize">{data.service} · {data.mood} · {data.intensity}</p>
                </div>
              </div>

              {/* Mobile Service Banner */}
              <div className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Home size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground font-body">We Come To You 🏡</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Enter your address below and we'll travel to your home or preferred location in {SALON_INFO.service_area}.</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground font-body tracking-wide uppercase">Your Info</label>
                {[
                  { IconComp: User, placeholder: "Full Name *", key: "name", type: "text" },
                  { IconComp: Mail, placeholder: "Email Address *", key: "email", type: "email" },
                  { IconComp: Phone, placeholder: "Phone Number", key: "phone", type: "tel" },
                  { IconComp: MapPin, placeholder: "Your Address (Street, City) *", key: "address", type: "text" },
                ].map(({ IconComp, placeholder, key, type }) => (
                  <div key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus-within:border-primary/50 transition-colors">
                    <IconComp size={15} className="text-muted-foreground" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/60 outline-none font-body"
                    />
                  </div>
                ))}
              </div>

              {/* Date & Time */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground font-body tracking-wide uppercase">Appointment</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus-within:border-primary/50 transition-colors">
                  <Calendar size={15} className="text-muted-foreground" />
                  <input
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="flex-1 bg-transparent text-sm text-foreground outline-none font-body"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setForm({ ...form, time: slot })}
                      className={`py-2 rounded-lg text-xs font-medium font-body border transition-all ${
                        form.time === slot
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground font-body tracking-wide uppercase">
                  ${SALON_INFO.deposit_amount} Deposit — Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("solana")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      paymentMethod === "solana"
                        ? "border-primary/60 bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="text-2xl mb-1">◎</div>
                    <p className="text-sm font-semibold text-foreground font-body">Solana</p>
                    <p className="text-xs text-muted-foreground font-body">SOL / USDC</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("etransfer")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      paymentMethod === "etransfer"
                        ? "border-primary/60 bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="text-2xl mb-1">💸</div>
                    <p className="text-sm font-semibold text-foreground font-body">e-Transfer</p>
                    <p className="text-xs text-muted-foreground font-body">Interac</p>
                  </button>
                </div>

                <AnimatePresence>
                  {paymentMethod === "solana" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-secondary/60 border border-border space-y-2"
                    >
                      <p className="text-xs font-semibold text-foreground font-body">Send ${SALON_INFO.deposit_amount} USD in SOL or USDC to:</p>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                        <code className="text-xs text-primary font-mono flex-1 break-all">
                          {SALON_INFO.solana_wallet}
                        </code>
                        <button
                          onClick={() => handleCopy(SALON_INFO.solana_wallet)}
                          className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-primary" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">
                        📝 Add your full name in the transaction memo/note to confirm your payment. Screenshot your transaction and bring it to your appointment.
                      </p>
                    </motion.div>
                  )}
                  {paymentMethod === "etransfer" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-secondary/60 border border-border space-y-2"
                    >
                      <p className="text-xs font-semibold text-foreground font-body">Send ${SALON_INFO.deposit_amount} CAD via Interac e-Transfer to:</p>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                        <code className="text-sm text-primary font-mono flex-1">
                          {SALON_INFO.etransfer_email}
                        </code>
                        <button
                          onClick={() => handleCopy(SALON_INFO.etransfer_email)}
                          className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-primary" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">
                        📝 Message: Your name + appointment date
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <button
                disabled={!isFormValid || loading}
                onClick={handleSubmit}
                className="w-full py-4 bg-foreground text-background font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    Save Look & Book Appointment
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}