import { useState } from "react";
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

      <div className="relative max-w-xl mx-auto px-5 py-10 sm:py-16">
        <Header currentStep={step} />

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
            Powered by Lumina AI · Beauty Hub
          </p>
        </div>
      </div>
    </div>
  );
}