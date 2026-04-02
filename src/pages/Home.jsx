import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Header from "../components/beauty/Header";
import StepOne from "../components/beauty/StepOne";
import StepTwo from "../components/beauty/StepTwo";
import StepThree from "../components/beauty/StepThree";

const INITIAL_DATA = {
  service: "",
  occasion: "",
  mood: "",
  intensity: "",
  styles: [],
  color: "",
  inspirationPhotos: [],
  notes: "",
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const restart = () => {
    setStep(0);
    setData(INITIAL_DATA);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Full background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69cdcb4ca203bc12233e8c04/e8937607d_generated_image.png')" }}
      />
      <div className="fixed inset-0 bg-black/65" />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      {/* Admin / Portal top-right */}
      <div className="fixed top-4 right-4 z-20 flex items-center gap-2">
        {user ? (
          user.role === "admin" ? (
            <a
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 border border-border backdrop-blur-sm text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield size={13} className="text-primary" />
              Admin
            </a>
          ) : (
            <a
              href="/portal"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 border border-border backdrop-blur-sm text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              My Portal
            </a>
          )
        ) : (
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 border border-border backdrop-blur-sm text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Shield size={13} className="text-primary" />
            Admin Login
          </button>
        )}
      </div>

      <div className="relative max-w-xl mx-auto px-5 py-10 sm:py-16">
        <Header currentStep={step} />

        {step === 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold font-body text-purple-300 backdrop-blur-sm shadow-sm">
              ◎ Accepts Solana
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold font-body text-pink-300 backdrop-blur-sm shadow-sm">
              🏡 We Come To You
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-semibold font-body text-rose-300 backdrop-blur-sm shadow-sm">
              📍 Ottawa & Gatineau Only
            </span>
          </div>
        )}

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepOne
                key="step1"
                data={data}
                onChange={setData}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StepTwo
                key="step2"
                data={data}
                onChange={setData}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <StepThree
                key="step3"
                data={data}
                onBack={() => setStep(1)}
                onRestart={restart}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/50 font-body">
            Powered by LBC.NETWORK
          </p>
        </div>
      </div>
    </div>
  );
}