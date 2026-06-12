import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, Chip, MONO, cardStyle, primaryGradient } from "../ui";

const BrightnessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="#8A8A8A" strokeWidth="1.7" />
    <path
      d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4L5.6 5.6"
      stroke="#8A8A8A"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const splits = [
  { label: "0–30", value: "1.71", unit: "SEC" },
  { label: "0–50", value: "2.92", unit: "SEC" },
  { label: "0–60", value: "4.38", unit: "SEC" },
  { label: "¼ mile", value: "11.10", unit: "SEC" },
  { label: "Distance", value: "1.32", unit: "MI" },
  { label: "Avg speed", value: "46.8", unit: "MPH" },
] as const;

export default function SpeedRun() {
  const navigate = useNavigate();
  const [speed, setSpeed] = useState(78.2);

  useEffect(() => {
    const id = setInterval(() => {
      setSpeed(78.2 + (Math.random() * 0.6 - 0.3));
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <Screen tab="ride">
      <ScreenHeader title="Speed run" backTo="/pwclab/ride" right={<BrightnessIcon />} />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip tint="green" dot>
            GPS verified
          </Chip>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: "#8A8A8A", letterSpacing: 1 }}>12 SATELLITES</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: "#8A8A8A" }}>▮ 100%</div>
        </div>

        <div style={{ position: "relative", width: 282, height: 282, margin: "4px auto 0 auto", flexShrink: 0 }}>
          <svg width="282" height="282" viewBox="0 0 282 282" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 20px rgba(225,6,0,0.38))" }}>
            <defs>
              <linearGradient id="spdGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3DDC84" />
                <stop offset="35%" stopColor="#FFC53D" />
                <stop offset="72%" stopColor="#E10600" />
                <stop offset="100%" stopColor="#E10600" />
              </linearGradient>
            </defs>
            <circle cx="141" cy="141" r="138" fill="none" stroke="#262626" strokeWidth="5" strokeDasharray="2 15.65" transform="rotate(135 141 141)" />
            <circle cx="141" cy="141" r="124" fill="none" stroke="#1B1B1B" strokeWidth="16" strokeLinecap="round" strokeDasharray="584.3 779.1" transform="rotate(135 141 141)" />
            <circle cx="141" cy="141" r="124" fill="none" stroke="url(#spdGrad)" strokeWidth="16" strokeLinecap="round" strokeDasharray="449.9 779.1" transform="rotate(135 141 141)" />
            <circle cx="141" cy="141" r="104" fill="none" stroke="#161616" strokeWidth="1" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 68, lineHeight: 1, color: "#fff" }}>{speed.toFixed(1)}</div>
            <div style={{ color: "#8A8A8A", fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>MPH</div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Top</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, color: "#E10600" }}>81.4</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, flexShrink: 0 }}>
          {splits.map((s) => (
            <div key={s.label} style={{ ...cardStyle, borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21 }}>{s.value}</div>
                <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 700 }}>{s.unit}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0, marginTop: 2 }}>
          <div
            onClick={() => navigate("/pwclab/ride/report")}
            style={{
              flex: 1,
              height: 58,
              background: primaryGradient,
              borderRadius: 14,
              border: "1px solid #FF3B2B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 0 26px rgba(225,6,0,0.35)",
              cursor: "pointer",
            }}
          >
            <div style={{ width: 13, height: 13, background: "#fff", borderRadius: 2 }} />
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: 1.5, textTransform: "uppercase" }}>Stop run</div>
          </div>
          <div style={{ ...cardStyle, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="#8A8A8A" strokeWidth="1.7" />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#8A8A8A" strokeWidth="1.7" />
            </svg>
          </div>
        </div>
      </div>
    </Screen>
  );
}
