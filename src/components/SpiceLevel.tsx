import { Flame } from "lucide-react";

const spiceLabels: Record<number, string> = {
  0: "No Heat",
  1: "Mild",
  2: "Medium",
  3: "Hot",
  4: "Fire",
};

interface SpiceLevelProps {
  level: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const SpiceLevel = ({ level, max = 4, showLabel = true, size = "sm" }: SpiceLevelProps) => {
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div>
      <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">
        Heat Level
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: max }).map((_, i) => (
            <Flame
              key={i}
              className={`${iconSize} transition-colors ${
                i < level ? "fill-amber-500 text-amber-500" : "text-muted/30"
              }`}
            />
          ))}
        </div>
        {showLabel && (
          <span className="text-xs font-display font-semibold uppercase tracking-wider text-foreground/70">
            {spiceLabels[level] || "Mild"}
          </span>
        )}
      </div>
    </div>
  );
};

export default SpiceLevel;
