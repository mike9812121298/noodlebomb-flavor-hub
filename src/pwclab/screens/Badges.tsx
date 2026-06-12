import { Screen, ScreenHeader, MONO, cardStyle } from "../ui";
import { badges } from "../data";

const TINTS: Record<string, { bg: string; border: string; color: string }> = {
  gold: { bg: "rgba(255,197,61,0.12)", border: "rgba(255,197,61,0.45)", color: "#FFC53D" },
  red: { bg: "rgba(225,6,0,0.12)", border: "rgba(225,6,0,0.45)", color: "#FF453A" },
  green: { bg: "rgba(61,220,132,0.1)", border: "rgba(61,220,132,0.4)", color: "#3DDC84" },
  white: { bg: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.25)", color: "#CFCFCF" },
  blue: { bg: "rgba(62,168,239,0.1)", border: "rgba(62,168,239,0.4)", color: "#3EA8EF" },
};

const GLYPH_SIZES: Record<string, number> = {
  "1": 16,
  "80+": 12,
  "0-50": 10.5,
  "¼": 13,
  MI: 12,
  HRS: 11,
  REC: 10.5,
  "7X": 12,
};

export default function Badges() {
  return (
    <Screen tab="leaders">
      <ScreenHeader title="Badges" backTo="/pwclab/profile" />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <div style={{ color: "#8A8A8A", fontSize: 12.5, lineHeight: 1.5 }}>
          Titles, not trophies — most are held by one rider per lake until someone takes them.
        </div>

        {badges.map((badge) => {
          const tint = TINTS[badge.tint];
          return (
            <div
              key={badge.title}
              style={{ ...cardStyle, borderRadius: 12, padding: "11px 13px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: tint.bg,
                  border: `1px solid ${tint.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontFamily: MONO, color: tint.color, fontSize: GLYPH_SIZES[badge.glyph] ?? 12, fontWeight: 800 }}>{badge.glyph}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{badge.title}</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>{badge.desc}</div>
              </div>
              {badge.status.kind === "earned" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    height: 24,
                    padding: "0 9px",
                    borderRadius: 999,
                    background: "rgba(61,220,132,0.12)",
                    border: "1px solid rgba(61,220,132,0.4)",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ color: "#3DDC84", fontSize: 10.5, fontWeight: 600 }}>{badge.status.text}</div>
                </div>
              ) : (
                <div style={{ fontFamily: MONO, color: "#555", fontSize: 10, textAlign: "right", flexShrink: 0 }}>
                  {badge.status.text.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
