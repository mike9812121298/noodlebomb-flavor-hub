import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen, Sheet, ChevronRight, MONO, cardStyle } from "../ui";

const GearIcon = () => (
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

const FEEDBACK_CATEGORIES = ["Bug", "GPS issue", "Wrong ski", "Wrong part rec", "Design", "Feature request"];

const achievementTile = {
  ...cardStyle,
  borderRadius: 12,
  padding: "11px 6px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: 4,
};

export default function Profile() {
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [category, setCategory] = useState("Bug");

  return (
    <Screen tab="profile">
      <div
        style={{
          height: 58,
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "36px 1fr 36px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div />
        <div style={{ textAlign: "center", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Profile</div>
        <div style={{ justifySelf: "end", display: "flex" }}>
          <GearIcon />
        </div>
      </div>
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#1B1B1B",
              border: "1px solid #2E2E2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B5B5B5",
              fontSize: 21,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            JR
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Jake R.</div>
            <div style={{ fontFamily: MONO, color: "#E10600", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5 }}>PWC LAB PRO</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-6.5-5.5-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.5 12 21 12 21z"
                  stroke="#8A8A8A"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ color: "#8A8A8A", fontSize: 12 }}>Lake Tapps, WA</div>
            </div>
          </div>
        </div>

        <div
          style={{ ...cardStyle, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19 }}>128</div>
            <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Rides</div>
          </div>
          <div style={{ width: 1, height: 30, background: "#252525" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19 }}>52.3</div>
            <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Engine hrs</div>
          </div>
          <div style={{ width: 1, height: 30, background: "#252525" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19 }}>42.6</div>
            <div style={{ color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Longest mi</div>
          </div>
        </div>

        <div
          onClick={() => navigate("/pwclab/badges")}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", cursor: "pointer", flexShrink: 0 }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              borderLeft: "3px solid #E10600",
              paddingLeft: 8,
              lineHeight: 1.1,
            }}
          >
            Achievements
          </div>
          <div style={{ fontFamily: MONO, color: "#555", fontSize: 10.5 }}>4 of 12</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, flexShrink: 0 }}>
          <div style={achievementTile}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, color: "#E10600" }}>80+</div>
            <div style={{ color: "#8A8A8A", fontSize: 8.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" }}>MPH club</div>
          </div>
          <div style={achievementTile}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, color: "#3DDC84" }}>S2</div>
            <div style={{ color: "#8A8A8A", fontSize: 8.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" }}>Verified</div>
          </div>
          <div style={achievementTile}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, color: "#fff" }}>1K</div>
            <div style={{ color: "#8A8A8A", fontSize: 8.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" }}>Miles</div>
          </div>
          <div
            style={{
              background: "#0C0C0C",
              border: "1px dashed #2A2A2A",
              borderRadius: 12,
              padding: "11px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: 0.7,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="#555" strokeWidth="1.7" />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#555" strokeWidth="1.7" />
            </svg>
            <div style={{ color: "#555", fontSize: 8.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" }}>Top 10</div>
          </div>
        </div>

        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1E1E1E" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>My skis</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 12 }}>2</div>
              <ChevronRight size={14} />
            </div>
          </div>
          <div
            onClick={() => navigate("/pwclab/ride/report")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid #1E1E1E",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ride reports</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 12 }}>128</div>
              <ChevronRight size={14} />
            </div>
          </div>
          <div
            onClick={() => navigate("/pwclab/garage/maintenance")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid #1E1E1E",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Maintenance log</div>
            <ChevronRight size={14} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Following <span style={{ color: "#8A8A8A", fontWeight: 500 }}>24</span> · Followers{" "}
              <span style={{ color: "#8A8A8A", fontWeight: 500 }}>87</span>
            </div>
            <ChevronRight size={14} />
          </div>
        </div>

        <div
          onClick={() => setFeedbackOpen(true)}
          style={{
            background: "rgba(62,168,239,0.07)",
            border: "1px solid rgba(62,168,239,0.3)",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6z" stroke="#3EA8EF" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#3EA8EF", fontSize: 13.5, fontWeight: 700 }}>Send beta feedback</div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>Bug · GPS issue · design · feature request</div>
          </div>
          <ChevronRight size={14} color="#3EA8EF" />
        </div>
      </div>

      <Sheet open={feedbackOpen} onClose={() => setFeedbackOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Send beta feedback</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {FEEDBACK_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <div
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 30,
                    padding: "0 12px",
                    borderRadius: 999,
                    background: active ? "rgba(62,168,239,0.1)" : "#111",
                    border: active ? "1px solid #3EA8EF" : "1px solid #272727",
                    color: active ? "#3EA8EF" : "#8A8A8A",
                    fontSize: 11.5,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div
              style={{
                height: 40,
                background: "#111",
                border: "1px solid #272727",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
              }}
            >
              <div style={{ color: "#fff", fontSize: 11.5, fontWeight: 600 }}>Screen: Speed Run</div>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              style={{
                height: 40,
                background: "#111",
                border: "1px dashed #2A2A2A",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="13" rx="2" stroke="#8A8A8A" strokeWidth="1.6" />
                <circle cx="12" cy="12.5" r="3" stroke="#8A8A8A" strokeWidth="1.6" />
              </svg>
              <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600 }}>Add screenshot</div>
            </div>
          </div>
          <div style={{ height: 58, background: "#111", border: "1px solid #272727", borderRadius: 11, padding: "10px 13px", color: "#555", fontSize: 12 }}>
            What happened?
          </div>
          <div
            onClick={() => setFeedbackOpen(false)}
            style={{
              height: 44,
              background: "rgba(62,168,239,0.12)",
              border: "1px solid #3EA8EF",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3EA8EF",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Submit feedback
          </div>
        </div>
      </Sheet>
    </Screen>
  );
}
