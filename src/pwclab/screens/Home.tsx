import { useNavigate } from "react-router-dom";
import { Screen, Wordmark, SectionHeader, MetricTile, ChevronRight, MONO, cardStyle, primaryGradient } from "../ui";
import { ski } from "../data";

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.7 5.7-1.7 5.7h14.4s-1.7-1.7-1.7-5.7A5.5 5.5 0 0 0 12 4z"
      stroke="#8A8A8A"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M10.3 18.5a1.9 1.9 0 0 0 3.4 0" stroke="#8A8A8A" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const activityIconWrap = (bg: string) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
} as const);

export default function Home() {
  const navigate = useNavigate();

  return (
    <Screen tab="home">
      <div style={{ height: 58, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Wordmark size={21} />
        <BellIcon />
      </div>
      <div
        className="pwl-scroll"
        style={{ flex: 1, padding: "2px 16px 0 16px", display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}
      >
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #252525", background: "#111", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <img
              src={ski.photo}
              alt={ski.name}
              onClick={() => navigate("/pwclab/garage")}
              style={{ width: "100%", height: 148, display: "block", objectFit: "cover", cursor: "pointer" }}
            />
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, pointerEvents: "none" }}>
              <div
                style={{
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.72)",
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                2024 RXP-X 325
              </div>
              <div
                style={{
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.72)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3DDC84" }} />
                <div style={{ color: "#3DDC84", fontSize: 11, fontWeight: 600 }}>Verified</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #252525" }}>
            <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 1, borderRight: "1px solid #252525" }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Engine hours</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#fff" }}>52.3</div>
            </div>
            <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Last ride</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#fff" }}>May 18</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/pwclab/ride")}
          style={{
            height: 56,
            background: primaryGradient,
            borderRadius: 14,
            border: "1px solid #FF3B2B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexShrink: 0,
            boxShadow: "0 0 26px rgba(225,6,0,0.35)",
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 1.5L12 7L3 12.5Z" fill="#fff" />
          </svg>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: 1.5, textTransform: "uppercase" }}>Start ride</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <SectionHeader action="View all" onAction={() => navigate("/pwclab/leaders")}>
            Performance snapshot
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MetricTile label="Top speed" value="81.4" unit="MPH" unitColor="#E10600" />
            <MetricTile label="0–60 time" value="4.38" unit="SEC" />
            <MetricTile label="Longest ride" value="42.6" unit="MI" />
            <div
              onClick={() => navigate("/pwclab/garage/mods")}
              style={{ ...cardStyle, borderRadius: 12, padding: "11px 14px", display: "flex", flexDirection: "column", gap: 2, cursor: "pointer" }}
            >
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Mods installed</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, lineHeight: 1.1 }}>8</div>
                <div style={{ color: "#8A8A8A", fontSize: 10.5, fontWeight: 600 }}>View mods</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <SectionHeader action="View all">Recent activity</SectionHeader>
          <div style={{ ...cardStyle, borderRadius: 12, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid #1E1E1E" }}>
              <div style={activityIconWrap("rgba(61,220,132,0.12)")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>New top speed</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>May 18, 2024</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#3DDC84" }}>81.4 mph</div>
            </div>
            <div
              onClick={() => navigate("/pwclab/ride/report")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid #1E1E1E", cursor: "pointer" }}
            >
              <div style={activityIconWrap("rgba(62,168,239,0.12)")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18c3-1 4-8 8-8s5 5 8 4" stroke="#3EA8EF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Ride report ready</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>Lake Havasu · 24.5 mi</div>
              </div>
              <ChevronRight size={14} />
            </div>
            <div
              onClick={() => navigate("/pwclab/garage/maintenance")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer" }}
            >
              <div style={activityIconWrap("rgba(255,197,61,0.12)")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5l3 2" stroke="#FFC53D" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="8.5" stroke="#FFC53D" strokeWidth="1.8" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Oil &amp; filter due</div>
                <div style={{ color: "#8A8A8A", fontSize: 11 }}>in 14.7 engine hrs</div>
              </div>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
