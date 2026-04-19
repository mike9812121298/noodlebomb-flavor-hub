import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, RotateCcw } from "lucide-react";
import SpiceLevel from "@/components/SpiceLevel";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "Do you like spicy?",
    options: [
      { label: "No heat", value: "mild" },
      { label: "Medium heat", value: "medium" },
      { label: "Bring the fire 🔥", value: "hot" },
    ],
  },
  {
    question: "What are you cooking?",
    options: [
      { label: "Ramen", value: "noodles" },
      { label: "Steak", value: "grill" },
      { label: "Wings", value: "wings" },
      { label: "Seafood", value: "seafood" },
      { label: "Rice Bowls", value: "rice" },
    ],
  },
  {
    question: "Flavor preference?",
    options: [
      { label: "Rich & Umami", value: "rich" },
      { label: "Garlic-forward", value: "garlic" },
      { label: "Bright & Citrus", value: "fresh" },
    ],
  },
];

type SauceResult = {
  name: string;
  tagline: string;
  description: string;
  spice: number;
};

const sauceImages: Record<string, string> = {
  original: nbOriginal,
  spicy: nbSpicyTokyo,
  ryugarlic: nbRyuGarlic,
  citrus: nbCitrusShoyu,
};

const results: Record<string, SauceResult> = {
  original: {
    name: "Original",
    tagline: "Umami, Perfected",
    description: "Your all-purpose flavor hero — a perfect harmony of soy, garlic, ginger, and a hint of sweetness.",
    spice: 1,
  },
  spicy: {
    name: "Spicy Tokyo",
    tagline: "The Street Heat Legend",
    description: "Bold dark soy, roasted chili, and sesame combine for that rich, layered spice.",
    spice: 3,
  },
  ryugarlic: {
    name: "Ryu Garlic",
    tagline: "The Fire-Breathing Umami King",
    description: "A fusion of roasted black garlic, chili oil, and toasted sesame, creating a deep, rich umami punch.",
    spice: 2,
  },
  citrus: {
    name: "Citrus Shoyu",
    tagline: "The Bright Side of Bold",
    description: "Vibrant lemon, orange, and bright citrus for a clean, tangy finish.",
    spice: 1,
  },
};

function getRecommendation(answers: string[]): string {
  const [spice, cooking, flavor] = answers;
  if (flavor === "garlic") return "ryugarlic";
  if (spice === "hot" || (spice === "medium" && (cooking === "grill" || cooking === "wings"))) return "spicy";
  if (cooking === "seafood" || flavor === "fresh" || spice === "mild") return "citrus";
  return "original";
}

const SauceSelector = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const done = step >= questions.length;
  const result = done ? results[getRecommendation(answers)] : null;

  return (
    <div className="min-h-screen bg-background pt-24 flex items-center">
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-2 block">
                    Question {step + 1} of {questions.length}
                  </span>
                  <div className="flex gap-2 mb-6">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gradient-fire" : "bg-muted"}`} />
                    ))}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    {questions[step].question}
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="group text-left px-6 py-5 rounded-2xl border border-border bg-gradient-card transition-all hover:border-primary hover:shadow-glow"
                    >
                      <span className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <Flame className="h-10 w-10 text-primary mx-auto mb-4" />
                <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">
                  Your Perfect Match
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{result!.name}</h2>
                <p className="text-lg text-muted-foreground mb-8">{result!.tagline}</p>

                <div className="bg-gradient-card rounded-3xl border border-border overflow-hidden max-w-sm mx-auto mb-8">
                <div className="min-h-[360px] bg-card rounded-t-3xl flex items-center justify-center px-6 py-8">
                    <img src={sauceImages[getRecommendation(answers)]} alt={result!.name} className="h-64 w-auto object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.1)]" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-center mb-3">
                      <SpiceLevel level={result!.spice} size="md" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result!.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/shop"
                    className="bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-fire hover:scale-105 flex items-center gap-2 shadow-fire"
                  >
                    Shop This Sauce <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/recipes"
                    className="border border-border px-6 py-4 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-all"
                  >
                    See Recipes
                  </Link>
                </div>
                <button
                  onClick={reset}
                  className="mt-6 flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors font-display"
                >
                  <RotateCcw className="h-4 w-4" /> Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SauceSelector;
