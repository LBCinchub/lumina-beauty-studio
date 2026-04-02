import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ServiceCard from "./ServiceCard";
import PriceSummary from "./PriceSummary";

const SERVICES = [
  {
    id: "nails",
    label: "Nails",
    emoji: "💅",
    description: "Manicure, gel, nail art & extensions",
    image: "https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/5ef88c396_generated_09b532af.png",
  },
  {
    id: "skincare",
    label: "Skin Care",
    emoji: "✨",
    description: "Facials, treatments & glow-ups",
    image: "https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/8dd0ae921_generated_56f04ffc.png",
  },
  {
    id: "lashes",
    label: "Lashes",
    emoji: "👁️",
    description: "Extensions, lifts & tinting",
    image: "https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/5c91eb348_generated_2cac25b3.png",
  },
];

const OCCASIONS = [
  { id: "everyday", emoji: "🌿", label: "Everyday Glam" },
  { id: "wedding", emoji: "💍", label: "Wedding / Bridal" },
  { id: "party", emoji: "🎉", label: "Party Night" },
  { id: "photoshoot", emoji: "📸", label: "Photo Shoot" },
  { id: "selfcare", emoji: "🧖", label: "Self-Care Day" },
  { id: "vacation", emoji: "🌴", label: "Vacation Ready" },
];

const MOODS = ["Glamorous", "Natural", "Bold", "Romantic", "Edgy", "Soft", "Dramatic", "Minimalist"];

const INTENSITIES = ["Subtle", "Balanced", "Full Glam"];

export default function StepOne({ data, onChange, onNext }) {
  const [customMood, setCustomMood] = useState("");

  const isValid = data.service && data.occasion && data.mood && data.intensity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Service Selection */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          Choose your service
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={data.service === service.id}
              onClick={() => onChange({ ...data, service: service.id })}
            />
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          What's the occasion?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              onClick={() => onChange({ ...data, occasion: occ.id })}
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                data.occasion === occ.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary"
              }`}
            >
              <span className="text-lg">{occ.emoji}</span>
              <span className="text-sm font-medium font-body text-foreground">
                {occ.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          The vibe
        </label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => onChange({ ...data, mood })}
              className={`px-4 py-2 rounded-full text-sm font-medium font-body border transition-all duration-200 ${
                data.mood === mood
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
              }`}
            >
              {mood}
            </button>
          ))}
          <input
            type="text"
            placeholder="Or type your own..."
            value={customMood}
            onChange={(e) => {
              setCustomMood(e.target.value);
              if (e.target.value) onChange({ ...data, mood: e.target.value });
            }}
            className="px-4 py-2 rounded-full text-sm bg-card border border-border text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary/60 w-44 font-body"
          />
        </div>
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          Intensity level
        </label>
        <div className="flex gap-3">
          {INTENSITIES.map((level) => (
            <button
              key={level}
              onClick={() => onChange({ ...data, intensity: level })}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold font-body border transition-all duration-200 ${
                data.intensity === level
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      {data.service && data.intensity && (
        <PriceSummary service={data.service} intensity={data.intensity} styles={[]} />
      )}

      {/* Continue Button */}
      <button
        disabled={!isValid}
        onClick={onNext}
        className="w-full py-4 bg-foreground text-background font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue to Creative Input
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}