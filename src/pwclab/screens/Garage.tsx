import { useNavigate } from "react-router-dom";
import { Screen, MONO, cardStyle } from "../ui";
import { ski } from "../data";

const Garage = () => {
  const navigate = useNavigate();

  const tabs: { label: string; to?: string }[] = [
    { label: "Overview" },
    { label: "Mods", to: "/pwclab/garage/mods" },
    { label: "Maintenance", to: "/pwclab/garage/maintenance" },
    { label: "Stats", to: "/pwclab/garage/mechanic" },
  ];

  return (
    <Screen tab="garage">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h10" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div style={{ textAlign: "center", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Garage</div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ justifySelf: "end" }}>
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="pwl-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <img src={ski.photo} alt="2024 RXP-X 325" style={{ width: "100%", height: 178, objectFit: "cover", display: "block", flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "12px 16px 0 16px", flexShrink: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 0.5 }}>2024 RXP-X 325</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 26,
                padding: "0 11px",
                borderRadius: 999,
                background: "#1B1B1B",
                border: "1px solid #252525",
              }}
            >
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>LONGEST</div>
              <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                42.6<span style={{ color: "#8A8A8A", fontWeight: 500 }}> MI</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 26,
                padding: "0 11px",
                borderRadius: 999,
                background: "#1B1B1B",
                border: "1px solid #252525",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.8,
              }}
            >
              STAGE 2
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 26,
                padding: "0 11px",
                borderRadius: 999,
                background: "rgba(225,6,0,0.08)",
                border: "1px solid rgba(225,6,0,0.4)",
                color: "#E10600",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: "pointer",
              }}
            >
              Edit ski
            </div>
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid #1E1E1E", padding: "0 16px", marginTop: 14, flexShrink: 0 }}>
          {tabs.map((t, i) => (
            <div
              key={t.label}
              onClick={t.to ? () => navigate(t.to!) : undefined}
              style={{
                padding: "8px 0 10px 0",
                marginRight: i < tabs.length - 1 ? 24 : 0,
                color: i === 0 ? "#E10600" : "#8A8A8A",
                fontSize: 12,
                fontWeight: i === 0 ? 700 : 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                borderBottom: i === 0 ? "2px solid #E10600" : undefined,
                marginBottom: i === 0 ? -1 : 0,
                cursor: t.to ? "pointer" : undefined,
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px 0 16px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          <div style={{ ...cardStyle, padding: "14px 16px 10px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
                Performance timeline
              </div>
              <div style={{ color: "#E10600", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View all</div>
            </div>
            <svg width="326" height="148" viewBox="0 0 326 148" style={{ display: "block" }}>
              <path d="M10 130 H316 M10 95 H316 M10 60 H316 M10 25 H316" stroke="#1C1C1C" strokeWidth="1" />
              <path d="M20 116 L115 88 L210 72 L305 28" stroke="#E10600" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="116" r="3.5" fill="#E10600" />
              <circle cx="115" cy="88" r="3.5" fill="#E10600" />
              <circle cx="210" cy="72" r="3.5" fill="#E10600" />
              <circle cx="305" cy="28" r="5" fill="#E10600" />
              <circle cx="305" cy="28" r="8.5" fill="none" stroke="#E10600" strokeOpacity="0.35" strokeWidth="1.5" />
              <text x="20" y="104" fill="#8A8A8A" fontFamily="JetBrains Mono, monospace" fontSize="9.5" textAnchor="middle">79.2</text>
              <text x="115" y="76" fill="#8A8A8A" fontFamily="JetBrains Mono, monospace" fontSize="9.5" textAnchor="middle">80.6</text>
              <text x="210" y="60" fill="#8A8A8A" fontFamily="JetBrains Mono, monospace" fontSize="9.5" textAnchor="middle">81.4</text>
              <text x="305" y="14" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="700" textAnchor="middle">83.6</text>
              <text x="20" y="144" fill="#666" fontFamily="'Chakra Petch', sans-serif" fontSize="9.5" textAnchor="middle">STOCK</text>
              <text x="115" y="144" fill="#666" fontFamily="'Chakra Petch', sans-serif" fontSize="9.5" textAnchor="middle">INTAKE</text>
              <text x="210" y="144" fill="#666" fontFamily="'Chakra Petch', sans-serif" fontSize="9.5" textAnchor="middle">EXHAUST</text>
              <text x="305" y="144" fill="#999" fontFamily="'Chakra Petch', sans-serif" fontSize="9.5" fontWeight="600" textAnchor="middle">STAGE 2</text>
            </svg>
          </div>
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
            {[
              { label: "Make", value: "Sea-Doo", mono: false },
              { label: "Model", value: "RXP-X 325", mono: false },
              { label: "Engine", value: "1.6L ACE-325 SC", mono: false },
              { label: "Engine hours", value: "52.3", mono: true },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  borderBottom: i < arr.length - 1 ? "1px solid #1E1E1E" : undefined,
                }}
              >
                <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>{row.label}</div>
                <div style={row.mono ? { fontFamily: MONO, fontSize: 13, fontWeight: 700 } : { fontSize: 13, fontWeight: 600 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default Garage;
