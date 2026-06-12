import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Chip, MONO, PrimaryButton, Screen, SectionHeader, Sheet } from "../ui";

const MODES = [
  { glyph: "MPH", label: "Speed testing" },
  { glyph: "CRZ", label: "Cruising" },
  { glyph: "GRP", label: "Group ride" },
  { glyph: "BRK", label: "Break-in ride" },
  { glyph: "MNT", label: "Maintenance test" },
  { glyph: "TUN", label: "Tuning test" },
];

const RideHub = () => {
  const navigate = useNavigate();
  const [sheetFor, setSheetFor] = useState<"speed" | "ride" | null>(null);
  const [mode, setMode] = useState(0);

  return (
    <Screen tab="ride">
      <div style={{ height: 58, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Ride</div>
        <Chip tint="green" dot>
          GPS ready · 12 sats
        </Chip>
      </div>
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        {/* Start Speed Run */}
        <div
          onClick={() => setSheetFor("speed")}
          style={{
            background: "linear-gradient(180deg, #1D0908 0%, #0D0404 100%)",
            border: "1px solid #7A0300",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 0 30px rgba(225,6,0,0.18)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "rgba(225,6,0,0.12)",
              border: "1px solid rgba(225,6,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 20a8 8 0 1 1 8-8" stroke="#FF453A" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M12 12l4.5-4.5" stroke="#FF453A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Start speed run</div>
            <div style={{ color: "#B5867F", fontSize: 11.5, lineHeight: 1.45 }}>
              GPS-verified. Counts for leaderboards.
              <br />
              Top speed · 0–30 · 0–50 · 0–60 · 30–70 · ⅛ · ¼ mi
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="#FF453A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Start Ride */}
        <Card radius={16} onClick={() => setSheetFor("ride")} style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid #2E2E2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 19c4-2 3-7 7-9s7 1 7-6" stroke="#CFCFCF" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 4" />
              <circle cx="5" cy="19" r="2.2" stroke="#CFCFCF" strokeWidth="1.6" />
              <circle cx="19" cy="4" r="2.2" stroke="#CFCFCF" strokeWidth="1.6" />
            </svg>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Start ride</div>
            <div style={{ color: "#8A8A8A", fontSize: 11.5, lineHeight: 1.45 }}>
              Casual tracking — route, distance, time,
              <br />
              avg speed. Builds your ride report.
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Card>
        {/* On Water card */}
        <Card radius={16} style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3DDC84" }} />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>On Water — Lake Tapps</div>
            </div>
            <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 10 }}>NOW</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 23 }}>7</div>
              <div style={{ color: "#8A8A8A", fontSize: 10.5, fontWeight: 600 }}>riders active</div>
            </div>
            <div style={{ width: 1, height: 22, background: "#252525" }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 23 }}>2</div>
              <div style={{ color: "#8A8A8A", fontSize: 10.5, fontWeight: 600 }}>group rides today</div>
            </div>
          </div>
          <div
            onClick={() => navigate("/pwclab/on-water")}
            style={{ height: 44, border: "1px solid #252525", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase" }}>See who's riding</div>
          </div>
        </Card>
        {/* Recent reports */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionHeader action="View all">Recent ride reports</SectionHeader>
          <Card radius={12} style={{ display: "flex", flexDirection: "column" }}>
            <div
              onClick={() => navigate("/pwclab/ride/report")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid #1E1E1E", cursor: "pointer" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Lake Havasu · Speed testing</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>May 18 · 24.5 mi · top 81.4</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              onClick={() => navigate("/pwclab/ride/report")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Lake Tapps · Cruising</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>May 11 · 18.2 mi · top 64.0</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Card>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 12, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v5" stroke="#FFC53D" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1" fill="#FFC53D" />
            <path d="M10.3 4 3.6 16a2 2 0 0 0 1.7 3h13.4a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z" stroke="#FFC53D" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: MONO, color: "#777", fontSize: 10 }}>Set up before you launch — never use while operating.</div>
        </div>
      </div>

      {/* Ride mode sheet */}
      <Sheet open={sheetFor !== null} onClose={() => setSheetFor(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 19, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>What are you doing today?</div>
          <div style={{ color: "#8A8A8A", fontSize: 12.5 }}>Sets up tracking and tags your ride report.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          {MODES.map((m, i) => {
            const selected = i === mode;
            return (
              <div
                key={m.glyph}
                onClick={() => setMode(i)}
                style={{
                  border: selected ? "2px solid #E10600" : "1px solid #272727",
                  background: selected ? "#170808" : "#111",
                  borderRadius: 13,
                  padding: "13px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontFamily: MONO, color: selected ? "#FF453A" : "#8A8A8A", fontSize: 13, fontWeight: 800 }}>{m.glyph}</div>
                <div style={{ fontSize: 13.5, fontWeight: selected ? 700 : 600, color: selected ? "#fff" : "#CFCFCF" }}>{m.label}</div>
              </div>
            );
          })}
        </div>
        <PrimaryButton
          height={54}
          fontSize={16}
          glow
          onClick={() => navigate(sheetFor === "speed" ? "/pwclab/speed-run" : "/pwclab/ride/navigate")}
        >
          Continue
        </PrimaryButton>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10, textAlign: "center" }}>
          Saved as ride_mode — filters reports + tunes recommendations.
        </div>
      </Sheet>
    </Screen>
  );
};

export default RideHub;
