import { Sparkles } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function Header({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-400 rounded-xl blur-lg opacity-50 animate-glow-pulse" />
          <div className="relative p-3 bg-gradient-to-br from-primary to-pink-400 rounded-xl">
            <Sparkles className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            LBC Beauty
          </h1>
          <p className="text-sm text-muted-foreground font-body tracking-wide">
            Lumina Beauty Consultant — Nails · Skin · Lashes
          </p>
        </div>
      </div>
      <ProgressBar currentStep={currentStep} totalSteps={3} />
    </div>
  );
}