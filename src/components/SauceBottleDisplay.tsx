import { cn } from "@/lib/utils";

type SauceBottleDisplayProps = {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

type BottleTone = {
  accent: string;
  ring: string;
  glow: string;
  glowSoft: string;
  surface: string;
  bar: string;
  series: string;
  short: string;
  kicker: string;
};

const sizeStyles = {
  xs: {
    wrapper: "h-[8.5rem] w-[5.5rem]",
    cap: "h-3 w-10",
    neck: "h-4 w-6",
    body: "h-[6.75rem] w-[4.5rem] rounded-[1.4rem]",
    panel: "inset-x-2 top-2 rounded-[0.9rem] px-2 py-2",
    footer: "hidden",
    series: "text-[0.35rem]",
    short: "text-[0.95rem]",
    watermark: "text-[2rem]",
  },
  sm: {
    wrapper: "h-[11.5rem] w-[7.5rem]",
    cap: "h-4 w-12",
    neck: "h-5 w-7",
    body: "h-[9.25rem] w-[6.25rem] rounded-[1.7rem]",
    panel: "inset-x-3 top-3 rounded-[1rem] px-2.5 py-2.5",
    footer: "inset-x-3 bottom-3 rounded-[1rem] px-2.5 py-2",
    series: "text-[0.45rem]",
    short: "text-[1.15rem]",
    watermark: "text-[2.5rem]",
  },
  md: {
    wrapper: "h-[14.5rem] w-[9rem]",
    cap: "h-4 w-14",
    neck: "h-6 w-8",
    body: "h-[11.75rem] w-[7.5rem] rounded-[1.9rem]",
    panel: "inset-x-3 top-3 rounded-[1.1rem] px-3 py-3",
    footer: "inset-x-3 bottom-3 rounded-[1rem] px-3 py-2.5",
    series: "text-[0.5rem]",
    short: "text-[1.35rem]",
    watermark: "text-[3rem]",
  },
  lg: {
    wrapper: "h-[17.5rem] w-[11rem]",
    cap: "h-5 w-16",
    neck: "h-7 w-10",
    body: "h-[14.25rem] w-[9rem] rounded-[2.1rem]",
    panel: "inset-x-4 top-4 rounded-[1.25rem] px-3.5 py-3.5",
    footer: "inset-x-4 bottom-4 rounded-[1.1rem] px-3.5 py-3",
    series: "text-[0.55rem]",
    short: "text-[1.7rem]",
    watermark: "text-[3.6rem]",
  },
} as const;

function getBottleTone(name: string): BottleTone {
  switch (name.toLowerCase()) {
    case "spicy tokyo":
      return {
        accent: "text-flame",
        ring: "border-flame/25",
        glow: "bg-flame/25",
        glowSoft: "bg-flame/10",
        surface: "from-card via-card to-flame/10",
        bar: "bg-gradient-to-r from-flame via-flame/35 to-transparent",
        series: "NB-02",
        short: "TOKYO",
        kicker: "Street Heat",
      };
    case "ryu garlic":
      return {
        accent: "text-secondary-foreground",
        ring: "border-secondary/70",
        glow: "bg-secondary/60",
        glowSoft: "bg-secondary/20",
        surface: "from-card via-card to-secondary",
        bar: "bg-gradient-to-r from-secondary-foreground via-secondary to-transparent",
        series: "NB-03",
        short: "RYU",
        kicker: "Black Garlic",
      };
    case "citrus shoyu":
      return {
        accent: "text-accent",
        ring: "border-accent/30",
        glow: "bg-accent/25",
        glowSoft: "bg-accent/10",
        surface: "from-card via-card to-accent/10",
        bar: "bg-gradient-to-r from-accent via-accent/35 to-transparent",
        series: "NB-04",
        short: "CITRUS",
        kicker: "Citrus Lift",
      };
    default:
      return {
        accent: "text-primary",
        ring: "border-primary/25",
        glow: "bg-primary/25",
        glowSoft: "bg-primary/10",
        surface: "from-card via-card to-primary/10",
        bar: "bg-gradient-to-r from-primary via-primary/35 to-transparent",
        series: "NB-01",
        short: "ORIG",
        kicker: "Umami Core",
      };
  }
}

const SauceBottleDisplay = ({ name, size = "md", className }: SauceBottleDisplayProps) => {
  const tone = getBottleTone(name);
  const styles = sizeStyles[size];

  return (
    <div className={cn("relative flex items-end justify-center", styles.wrapper, className)}>
      <div className="absolute bottom-2 h-6 w-[72%] rounded-full bg-background/90 blur-2xl" />
      <div className="relative flex flex-col items-center">
        <div className={cn("relative z-20 rounded-full border bg-card/95 shadow-sm", styles.cap, tone.ring)} />
        <div className={cn("-mt-1 rounded-t-[1rem] border border-b-0 bg-card/95", styles.neck, tone.ring)} />
        <div className={cn("relative -mt-1 overflow-hidden border bg-card/95 shadow-lift backdrop-blur-sm", styles.body, tone.ring)}>
          <div className={cn("absolute inset-0 bg-gradient-to-b", tone.surface)} />
          <div className={cn("absolute -right-6 top-5 h-20 w-20 rounded-full opacity-80 blur-2xl", tone.glow)} />
          <div className={cn("absolute -left-5 bottom-5 h-16 w-16 rounded-full opacity-50 blur-2xl", tone.glowSoft)} />
          <div className={cn("absolute border border-border/50 bg-background/70 backdrop-blur-sm", styles.panel)}>
            <p className={cn("font-display font-semibold uppercase tracking-[0.38em] text-foreground/35", styles.series)}>{tone.series}</p>
            <p className={cn("mt-3 font-display font-bold uppercase leading-none tracking-[0.08em]", styles.short, tone.accent)}>{tone.short}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className={cn("h-1.5 flex-1 rounded-full", tone.bar)} />
              <div className="h-1.5 w-4 rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className={cn("absolute border border-border/40 bg-background/55 backdrop-blur-sm", styles.footer)}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-[0.5rem] font-semibold uppercase tracking-[0.24em] text-foreground/50">{tone.kicker}</span>
              <span className="font-display text-[0.45rem] uppercase tracking-[0.2em] text-foreground/35">7 fl oz</span>
            </div>
          </div>
          <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[12%] font-display font-bold tracking-[-0.08em] text-foreground/10", styles.watermark)}>
            NB
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_32%,hsl(var(--foreground)/0.05)_48%,transparent_62%)]" />
          <div className="absolute inset-y-4 right-4 w-px bg-border/45" />
        </div>
      </div>
    </div>
  );
};

export default SauceBottleDisplay;