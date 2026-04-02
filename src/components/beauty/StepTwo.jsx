import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Upload, Image, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PriceSummary from "./PriceSummary";

const SERVICE_STYLES = {
  nails: [
    "French Tips", "Ombré", "Chrome / Mirror", "Marble",
    "Floral Art", "Minimalist Lines", "Glitter Accent", "Coffin Shape",
    "Almond Shape", "Stiletto", "3D Nail Art", "Cat Eye"
  ],
  skincare: [
    "Glass Skin", "Dewy Glow", "Matte Flawless", "Sun-Kissed",
    "Porcelain", "No-Makeup Makeup", "K-Beauty", "Clean Girl",
    "Hydrated & Plump", "Even Tone", "Anti-Aging", "Brightening"
  ],
  lashes: [
    "Natural Flutter", "Cat Eye", "Doll Eye", "Wispy",
    "Volume Full", "Hybrid", "Mega Volume", "Bottom Lashes",
    "Fox Eye", "Colored Tips", "Kim K", "Angel Lashes"
  ],
};

const SERVICE_COLORS = {
  nails: [
    { name: "Blush Pink", color: "#F4B4C7" },
    { name: "Nude", color: "#D4A88C" },
    { name: "Cherry Red", color: "#C93545" },
    { name: "Mauve", color: "#8B6E7F" },
    { name: "Midnight", color: "#1A1A2E" },
    { name: "Gold", color: "#D4A847" },
    { name: "Lavender", color: "#B4A7D6" },
    { name: "White", color: "#F5F0EB" },
  ],
  skincare: [],
  lashes: [],
};

export default function StepTwo({ data, onChange, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);
  const styles = SERVICE_STYLES[data.service] || [];
  const colors = SERVICE_COLORS[data.service] || [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({
      ...data,
      inspirationPhotos: [...(data.inspirationPhotos || []), file_url],
    });
    setUploading(false);
  };

  const removePhoto = (index) => {
    const photos = [...(data.inspirationPhotos || [])];
    photos.splice(index, 1);
    onChange({ ...data, inspirationPhotos: photos });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Style Preferences */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          Pick your style
        </label>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => {
                const selected = data.styles || [];
                const updated = selected.includes(style)
                  ? selected.filter((s) => s !== style)
                  : [...selected, style];
                onChange({ ...data, styles: updated });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium font-body border transition-all duration-200 ${
                (data.styles || []).includes(style)
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Color Preferences (Nails only) */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
            Color preference
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => onChange({ ...data, color: c.name })}
                className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                  data.color === c.name ? "scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    data.color === c.name ? "border-primary shadow-lg shadow-primary/30" : "border-border"
                  }`}
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-xs text-muted-foreground font-body">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inspiration Upload */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          Upload inspiration photos
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <div className="flex gap-3 flex-wrap">
          {(data.inspirationPhotos || []).map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 tracking-wide font-body">
          Anything else we should know?
        </label>
        <textarea
          placeholder="Describe your dream look, any allergies, preferences..."
          value={data.notes || ""}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary/60 font-body text-sm resize-none"
        />
      </div>

      {/* Price Summary */}
      <PriceSummary service={data.service} intensity={data.intensity} styles={data.styles || []} showDeposit hasCustomNotes={!!(data.notes && data.notes.trim())} />

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 border border-border text-foreground font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-secondary"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-[2] py-4 bg-foreground text-background font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
        >
          Get My Look ✨
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}