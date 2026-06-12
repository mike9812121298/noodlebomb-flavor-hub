import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, MONO, cardStyle, redTintCardStyle, primaryGradient } from "../ui";

const partRows = [
  { name: "GT40 Carbon Intake", have: true, note: "YOU HAVE IT" },
  { name: "GT40 ECM Flash", have: true, note: "YOU HAVE IT" },
  { name: "GT40 Intercooler", have: false, note: "ON 9 OF 10" },
  { name: "GT40 Rear Exhaust", have: false, note: "ON 7 OF 10" },
  { name: "GT40 Catch Can", have: true, note: "YOU HAVE IT" },
];

const BuildCompare = () => {
  const navigate = useNavigate();

  return (
    <Screen tab="leaders">
      <ScreenHeader title="Build compare" backTo="/pwclab/garage/upgrade-path" />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ ...cardStyle, padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>My ski</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.25 }}>
              2024 RXP-X 325
              <br />
              <span style={{ color: "#8A8A8A", fontWeight: 500, fontSize: 11.5 }}>4 performance parts</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 29 }}>81.4</div>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 700 }}>MPH</div>
            </div>
          </div>
          <div style={{ ...redTintCardStyle, padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ color: "#FF453A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Top 10 average</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.25 }}>
              2024 RXP-X 325
              <br />
              <span style={{ color: "#8A8A8A", fontWeight: 500, fontSize: 11.5 }}>6–8 performance parts</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 29, color: "#FF453A" }}>83.2</div>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 700 }}>MPH</div>
            </div>
          </div>
        </div>
        <div
          style={{
            ...cardStyle,
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>The gap</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 21, color: "#FFC53D" }}>−1.8</div>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 700 }}>MPH</div>
          </div>
        </div>
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
          Common parts on faster builds
        </div>
        <div style={{ ...cardStyle, borderRadius: 13, display: "flex", flexDirection: "column" }}>
          {partRows.map((row, i) => (
            <div
              key={row.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 14px",
                borderBottom: i < partRows.length - 1 ? "1px solid #1E1E1E" : undefined,
              }}
            >
              {row.have ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div style={{ width: 15, height: 15, borderRadius: 4, border: "1.5px solid #E10600", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: row.have ? 600 : 700 }}>{row.name}</div>
              <div style={{ fontFamily: MONO, color: row.have ? "#3DDC84" : "#FF453A", fontSize: 10.5 }}>{row.note}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>
          Parts ranked by presence on the top 10 verified builds in your class.
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 14, flexShrink: 0 }}>
          <div
            onClick={() => navigate("/pwclab/garage/upgrade-path")}
            style={{
              height: 56,
              background: primaryGradient,
              border: "1px solid #FF3B2B",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 26px rgba(225,6,0,0.3)",
              cursor: "pointer",
            }}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase" }}>See upgrade path</div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default BuildCompare;
