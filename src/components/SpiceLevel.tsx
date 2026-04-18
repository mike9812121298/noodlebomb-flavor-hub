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
  const squareSize = size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div>
      <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">
        Heat Level
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={`${squareSize} rounded-sm transition-colors`}
              style={{ backgroundColor: i < level ? "#c8960c" : "#374151" }}
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
