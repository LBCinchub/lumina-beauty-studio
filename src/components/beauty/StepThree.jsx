import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw, Sparkles, Heart, Share2, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SERVICE_LABELS = {
  nails: "Nails",
  skincare: "Skin Care",
  lashes: "Lashes",
};

export default function StepThree({ data, onBack, onRestart }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    generateRecommendation();
  }, []);

  const generateRecommendation = async () => {
    setLoading(true);
    setGeneratedImage(null);

    const serviceLabel = SERVICE_LABELS[data.service] || data.service;
    const prompt = `You are a luxury beauty consultant specializing in ${serviceLabel}. 
A client wants a ${data.mood} ${data.intensity} look for ${data.occasion}.
${data.styles?.length ? `Preferred styles: ${data.styles.join(", ")}` : ""}
${data.color ? `Preferred color: ${data.color}` : ""}
${data.notes ? `Additional notes: ${data.notes}` : ""}

Provide a personalized beauty recommendation with:
1. A creative name for this look
2. A detailed description of the recommended look
3. Step-by-step breakdown of what to ask for at the salon
4. Product recommendations (3-4 products)
5. Maintenance tips
6. A detailed image prompt describing this exact look for image generation (be very specific about colors, textures, lighting, style)`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          look_name: { type: "string" },
          description: { type: "string" },
          salon_steps: { type: "array", items: { type: "string" } },
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
              },
            },
          },
          maintenance_tips: { type: "array", items: { type: "string" } },
          image_prompt: { type: "string" },
        },
      },
    });

    setResult(res);
    setLoading(false);

    // Generate the look image
    setImageLoading(true);
    const imgRes = await base44.integrations.Core.GenerateImage({
      prompt: `${res.image_prompt}. Professional beauty photography, luxury editorial style, soft warm lighting, shallow depth of field, ultra high quality, magazine cover quality.`,
    });
    setGeneratedImage(imgRes.url);
    setImageLoading(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-400 animate-pulse" />
          <Sparkles className="absolute inset-0 m-auto text-white" size={28} />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          Creating your perfect look...
        </h3>
        <p className="text-sm text-muted-foreground font-body">
          Our AI is crafting personalized recommendations
        </p>
        <div className="mt-6 w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-pink-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium font-body text-primary">Your Custom Look</span>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          {result.look_name}
        </h2>
      </div>

      {/* Generated Image */}
      <div className="rounded-2xl overflow-hidden border border-border">
        {imageLoading ? (
          <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-body">Generating your look...</p>
            </div>
          </div>
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt={result.look_name}
            className="w-full aspect-[4/3] object-cover"
          />
        ) : null}
      </div>

      {/* Description */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* Salon Steps */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 font-body tracking-wide">
          💎 What to ask for at the salon
        </h3>
        <ol className="space-y-3">
          {result.salon_steps?.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground font-body">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Products */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 font-body tracking-wide">
          ✨ Recommended Products
        </h3>
        <div className="space-y-3">
          {result.products?.map((product, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground font-body">{product.name}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Tips */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 font-body tracking-wide">
          🌸 Maintenance Tips
        </h3>
        <ul className="space-y-2">
          {result.maintenance_tips?.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground font-body">
              <span className="text-primary">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-4 border border-border text-foreground font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-secondary"
        >
          <ChevronLeft size={18} />
          Edit
        </button>
        <button
          onClick={onRestart}
          className="flex-[2] py-4 bg-foreground text-background font-bold font-body rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
        >
          <RotateCcw size={16} />
          Start Over
        </button>
      </div>
    </motion.div>
  );
}