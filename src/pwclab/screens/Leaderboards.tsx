import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, ChevronDown, MONO, cardStyle, redTintCardStyle, primaryGradient } from "../ui";
import { leaderboardRows, records } from "../data";

const FilterLinesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="#E10600" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 11.5l2 2 4-4.5" stroke="#E10600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RANK_COLORS: Record<number, string> = { 1: "#FFC53D", 2: "#C9C9C9", 3: "#D08A3E" };

const BADGE_CHIPS: Record<string, { bg: string; border: string; color: string; fontSize: number; text: string }> = {
  "gold-1": { bg: "rgba(255,197,61,0.14)", border: "rgba(255,197,61,0.45)", color: "#FFC53D", fontSize: 8.5, text: "1" },
  "red-80": { bg: "rgba(225,6,0,0.12)", border: "rgba(225,6,0,0.45)", color: "#FF453A", fontSize: 7, text: "80" },
  "white-mi": { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.25)", color: "#CFCFCF", fontSize: 7, text: "MI" },
  "green-0-50": { bg: "rgba(61,220,132,0.12)", border: "rgba(61,220,132,0.4)", color: "#3DDC84", fontSize: 7, text: "0-50" },
};

function BadgeChip({ id }: { id: string }) {
  const c = BADGE_CHIPS[id];
  if (!c) return null;
  return (
    <div
      style={{
        alignSelf: "center",
        width: 16,
        height: 16,
        borderRadius: 4,
        background: c.bg,
        border: `1px solid ${c.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div style={{ fontFamily: MONO, color: c.color, fontSize: c.fontSize, fontWeight: 700 }}>{c.text}</div>
    </div>
  );
}

const Avatar = ({ initials }: { initials: string }) => (
  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "#1B1B1B",
      border: "1px solid #2E2E2E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#B5B5B5",
      fontSize: 13,
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

const metricTabs = ["Top speed", "0–50 time", "¼ mile", "Distance"];
const filters = [
  { label: "2024 RXP-X 325", flex: 1.4 },
  { label: "All builds", flex: 1 },
  { label: "West", flex: 1 },
];

export default function Leaderboards() {
  const navigate = useNavigate();
  const [segment, setSegment] = useState<"rankings" | "records">("rankings");

  return (
    <Screen tab="leaders">
      <ScreenHeader title="Leaderboards" backTo="/pwclab/home" right={<FilterLinesIcon />} />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ ...cardStyle, borderRadius: 12, display: "flex", padding: 4, gap: 4, flexShrink: 0 }}>
          {(["rankings", "records"] as const).map((seg) => {
            const active = segment === seg;
            return (
              <div
                key={seg}
                onClick={() => setSegment(seg)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 9,
                  background: active ? primaryGradient : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "#fff" : "#8A8A8A",
                  fontSize: 12,
                  fontWeight: active ? 700 : 600,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {seg === "rankings" ? "Rankings" : "Records"}
              </div>
            );
          })}
        </div>

        {segment === "rankings" ? (
          <>
            <div style={{ display: "flex", borderBottom: "1px solid #1E1E1E", flexShrink: 0 }}>
              {metricTabs.map((tab, i) => {
                const active = i === 0;
                return (
                  <div
                    key={tab}
                    style={{
                      padding: "8px 0 10px 0",
                      marginRight: i < metricTabs.length - 1 ? 22 : 0,
                      color: active ? "#E10600" : "#8A8A8A",
                      fontSize: 12,
                      fontWeight: active ? 700 : 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      borderBottom: active ? "2px solid #E10600" : undefined,
                      marginBottom: active ? -1 : 0,
                    }}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {filters.map((f) => (
                <div
                  key={f.label}
                  style={{
                    ...cardStyle,
                    flex: f.flex,
                    height: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px",
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{f.label}</div>
                  <ChevronDown />
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {leaderboardRows.map((row, i) => (
                <div
                  key={row.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderBottom: i < leaderboardRows.length - 1 ? "1px solid #1E1E1E" : undefined,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      fontFamily: MONO,
                      fontWeight: row.rank <= 3 ? 700 : 600,
                      fontSize: 14,
                      color: RANK_COLORS[row.rank] ?? "#555",
                    }}
                  >
                    {row.rank}
                  </div>
                  <Avatar initials={row.initials} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{row.name}</div>
                      {row.tag && <div style={{ fontFamily: MONO, color: "#E10600", fontSize: 10, fontWeight: 600 }}>{row.tag}</div>}
                      {row.badges.slice(0, 2).map((b) => (
                        <BadgeChip key={b} id={b} />
                      ))}
                    </div>
                    <div style={{ color: "#8A8A8A", fontSize: 11 }}>{row.where}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, color: "#fff" }}>{row.value}</div>
                    <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 700 }}>MPH</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              onClick={() => navigate("/pwclab/share-card")}
              style={{ ...redTintCardStyle, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, cursor: "pointer" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <div style={{ color: "#E10600", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>Your rank</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#fff" }}>7</div>
                  <div style={{ color: "#8A8A8A", fontSize: 12, fontWeight: 600 }}>of 142</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: "#fff" }}>81.4</div>
                  <div style={{ color: "#E10600", fontSize: 10, fontWeight: 700 }}>MPH</div>
                </div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>May 18, 2024</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 2px 0 2px", flexShrink: 0 }}>
              <ShieldIcon />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>PWC Lab certified records</div>
            </div>

            <div style={{ ...cardStyle, display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {records.map((rec, i) => (
                <div
                  key={rec.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderBottom: i < records.length - 1 ? "1px solid #1E1E1E" : undefined,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{rec.title}</div>
                    <div style={{ color: "#8A8A8A", fontSize: 11 }}>{rec.holder}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, color: "#E10600" }}>{rec.value}</div>
                    <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 700 }}>MPH</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", paddingTop: 2, flexShrink: 0 }}>
              Local — Lake Tapps
            </div>
            <div style={{ ...redTintCardStyle, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <Avatar initials="JR" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Lake record — held by you</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>Jake R. · May 18, 2024</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#fff" }}>81.4</div>
                <div style={{ color: "#E10600", fontSize: 9.5, fontWeight: 700 }}>MPH</div>
              </div>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
