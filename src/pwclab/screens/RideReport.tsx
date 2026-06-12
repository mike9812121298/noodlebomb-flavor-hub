import { useNavigate } from "react-router-dom";
import { MONO, Screen, ScreenHeader, cardStyle } from "../ui";

const tileLabel = { color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" } as const;
const tileBase = { ...cardStyle, borderRadius: 12, padding: "11px 12px", display: "flex", flexDirection: "column", gap: 1 } as const;

function Tile({ label, value, unit, valueColor = "#fff" }: { label: string; value: string; unit: string; valueColor?: string }) {
  return (
    <div style={tileBase}>
      <div style={tileLabel}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: valueColor }}>{value}</div>
        <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 700 }}>{unit}</div>
      </div>
    </div>
  );
}

const CONDITIONS = [
  { label: "GPS", value: "±2.4M · 12" },
  { label: "Air", value: "89°F" },
  { label: "Wind", value: "4 MPH" },
  { label: "Water", value: "CALM" },
  { label: "Fuel", value: "½ TANK" },
  { label: "Rider", value: "190 LB" },
];

const RideReport = () => {
  const navigate = useNavigate();

  return (
    <Screen tab="ride">
      <ScreenHeader
        title="Ride report"
        backTo="/pwclab/ride"
        right={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V4M8 7.5L12 3.5l4 4" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12v7h14v-7" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Lake Havasu, AZ</div>
            <div style={{ color: "#8A8A8A", fontSize: 11.5 }}>May 18, 2024 · 2:15 PM</div>
          </div>
          <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 12 }}>89°F · sunny</div>
        </div>
        {/* Map */}
        <div style={{ position: "relative", height: 226, borderRadius: 16, overflow: "hidden", border: "1px solid #252525", background: "#0B0F14", flexShrink: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 358 226" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <radialGradient id="rrWater" cx="50%" cy="58%" r="85%">
                <stop offset="0%" stopColor="#17597A" />
                <stop offset="55%" stopColor="#0F405C" />
                <stop offset="100%" stopColor="#0A2E44" />
              </radialGradient>
              <linearGradient id="rrLand" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94835A" />
                <stop offset="100%" stopColor="#74633D" />
              </linearGradient>
              <linearGradient id="rrSpeed" gradientUnits="userSpaceOnUse" x1="62" y1="168" x2="290" y2="58">
                <stop offset="0%" stopColor="#3DDC84" />
                <stop offset="35%" stopColor="#FFC53D" />
                <stop offset="70%" stopColor="#E10600" />
              </linearGradient>
              <filter id="rrTex" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="n" />
                <feColorMatrix in="n" type="saturate" values="0" />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
              <filter id="rrTerr" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves={4} result="n" />
                <feColorMatrix in="n" type="saturate" values="0" />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
            </defs>
            <rect x="0" y="0" width="358" height="226" fill="url(#rrWater)" />
            <rect x="0" y="0" width="358" height="226" fill="#ffffff" filter="url(#rrTex)" opacity="0.045" />
            <ellipse cx="200" cy="150" rx="150" ry="60" fill="#7FB7CC" opacity="0.05" />
            <path
              d="M0 92 C8 80 20 70 14 52 C8 32 0 28 0 28 L0 0 L120 0 C112 16 96 22 88 38 C78 58 92 70 76 84 C62 96 40 90 24 98 C12 104 0 100 0 100 Z M358 0 L358 70 C340 76 330 62 318 48 C306 34 312 18 322 0 Z M250 0 C246 10 236 16 240 26 C244 36 258 34 266 26 C274 18 270 6 268 0 Z"
              fill="none"
              stroke="#5FA8C2"
              strokeWidth="7"
              opacity="0.3"
            />
            <path
              d="M0 92 C8 80 20 70 14 52 C8 32 0 28 0 28 L0 0 L120 0 C112 16 96 22 88 38 C78 58 92 70 76 84 C62 96 40 90 24 98 C12 104 0 100 0 100 Z"
              fill="url(#rrLand)"
            />
            <path d="M358 0 L358 70 C340 76 330 62 318 48 C306 34 312 18 322 0 Z" fill="url(#rrLand)" />
            <path d="M250 0 C246 10 236 16 240 26 C244 36 258 34 266 26 C274 18 270 6 268 0 Z" fill="url(#rrLand)" />
            <g opacity="0.3">
              <path
                d="M0 92 C8 80 20 70 14 52 C8 32 0 28 0 28 L0 0 L120 0 C112 16 96 22 88 38 C78 58 92 70 76 84 C62 96 40 90 24 98 C12 104 0 100 0 100 Z"
                fill="#3A2F1A"
                filter="url(#rrTerr)"
              />
              <path d="M358 0 L358 70 C340 76 330 62 318 48 C306 34 312 18 322 0 Z" fill="#3A2F1A" filter="url(#rrTerr)" />
            </g>
            <ellipse cx="40" cy="30" rx="26" ry="14" fill="#4F6238" opacity="0.8" />
            <ellipse cx="78" cy="14" rx="20" ry="10" fill="#586D3E" opacity="0.65" />
            <ellipse cx="22" cy="68" rx="12" ry="18" fill="#4F6238" opacity="0.5" />
            <ellipse cx="334" cy="28" rx="16" ry="12" fill="#4F6238" opacity="0.75" />
            <ellipse cx="255" cy="14" rx="10" ry="7" fill="#586D3E" opacity="0.6" />
            <path
              d="M0 92 C8 80 20 70 14 52 C8 32 0 28 0 28 M120 0 C112 16 96 22 88 38 C78 58 92 70 76 84 C62 96 40 90 24 98 M358 70 C340 76 330 62 318 48 C306 34 312 18 322 0 M250 0 C246 10 236 16 240 26 C244 36 258 34 266 26 C274 18 270 6 268 0"
              fill="none"
              stroke="#E8D8A8"
              strokeWidth="1.2"
              opacity="0.55"
            />
            <path
              d="M100 120 C150 110 210 124 260 100 M80 160 C140 150 220 166 300 140 M130 196 C190 186 250 200 320 178"
              stroke="#2D7A99"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M62 168 C 90 120, 140 96, 178 104 C 226 114, 244 64, 282 58 C 306 54, 318 78, 300 96 C 274 122, 210 138, 178 158 C 150 176, 110 188, 86 180"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M62 168 C 90 120, 140 96, 178 104 C 226 114, 244 64, 282 58 C 306 54, 318 78, 300 96 C 274 122, 210 138, 178 158 C 150 176, 110 188, 86 180"
              fill="none"
              stroke="url(#rrSpeed)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="121" cy="100" r="2.6" fill="#fff" />
            <text x="121" y="91" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="7.5" textAnchor="middle" opacity="0.85">
              8 MI
            </text>
            <circle cx="231" cy="92" r="2.6" fill="#fff" />
            <text x="231" y="83" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="7.5" textAnchor="middle" opacity="0.85">
              16 MI
            </text>
            <rect x="258" y="32" width="50" height="15" rx="4" fill="rgba(0,0,0,0.78)" />
            <text x="283" y="42.5" fill="#FF453A" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="700" textAnchor="middle">
              81.4 TOP
            </text>
            <path d="M283 47 L283 54" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <circle cx="282" cy="58" r="3" fill="#E10600" stroke="#fff" strokeWidth="1.2" />
            <circle cx="62" cy="168" r="5" fill="#3DDC84" stroke="#fff" strokeWidth="1.5" />
            <circle cx="86" cy="180" r="5" fill="#E10600" stroke="#fff" strokeWidth="1.5" />
            <circle cx="86" cy="180" r="9.5" fill="none" stroke="#E10600" strokeOpacity="0.4" strokeWidth="1.5" />
          </svg>
          <div
            style={{ position: "absolute", right: 10, bottom: 10, height: 22, padding: "0 8px", borderRadius: 6, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", gap: 5 }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3DDC84" }} />
            <div style={{ fontFamily: MONO, color: "#B5B5B5", fontSize: 9, letterSpacing: 0.8 }}>±2.4 M · 12 SATS</div>
          </div>
          <div
            style={{ position: "absolute", left: 10, bottom: 10, height: 22, padding: "0 8px", borderRadius: 6, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", gap: 6 }}
          >
            <div style={{ width: 34, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #3DDC84, #FFC53D, #E10600)" }} />
            <div style={{ fontFamily: MONO, color: "#B5B5B5", fontSize: 8.5, letterSpacing: 0.8 }}>SPEED</div>
          </div>
          <div
            style={{ position: "absolute", left: 10, top: 10, height: 26, padding: "0 10px", borderRadius: 999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", gap: 5 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3DDC84" }} />
            <div style={{ color: "#3DDC84", fontSize: 11, fontWeight: 600 }}>GPS verified</div>
          </div>
        </div>
        {/* PB banner */}
        <div
          style={{
            background: "rgba(61,220,132,0.07)",
            border: "1px solid rgba(61,220,132,0.3)",
            borderRadius: 12,
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: 11,
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4z" stroke="#3DDC84" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 13.5V17M8.5 20h7" stroke="#3DDC84" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#3DDC84", fontSize: 13.5, fontWeight: 700 }}>New personal best — top speed</div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>previous 80.9 mph · Apr 28</div>
          </div>
          <div style={{ fontFamily: MONO, color: "#3DDC84", fontSize: 15, fontWeight: 700 }}>81.4</div>
        </div>
        {/* Tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, flexShrink: 0 }}>
          <Tile label="Distance" value="24.5" unit="MI" />
          <Tile label="Top speed" value="81.4" unit="MPH" valueColor="#3DDC84" />
          <Tile label="Avg speed" value="46.8" unit="MPH" />
          <div style={tileBase}>
            <div style={tileLabel}>Ride time</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, paddingTop: 3 }}>00:52:18</div>
          </div>
          <Tile label="Engine hrs" value="1.2" unit="HRS" />
          <Tile label="Water temp" value="71" unit="°F" />
        </div>
        {/* Run conditions */}
        <div style={{ ...cardStyle, borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Run conditions</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                height: 22,
                padding: "0 8px",
                borderRadius: 999,
                background: "rgba(61,220,132,0.12)",
                border: "1px solid rgba(61,220,132,0.4)",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3DDC84" }} />
              <div style={{ color: "#3DDC84", fontSize: 10, fontWeight: 600 }}>Run quality: A</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
            {CONDITIONS.map((c) => (
              <div key={c.label} style={{ background: "#111", border: "1px solid #272727", borderRadius: 9, padding: "8px 10px" }}>
                <div style={{ color: "#8A8A8A", fontSize: 8.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{c.label}</div>
                <div style={{ fontFamily: MONO, color: "#fff", fontSize: 12, fontWeight: 700 }}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5 }}>GPS auto · air/wind from weather API · water/fuel/rider optional manual.</div>
        </div>
        <div
          onClick={() => navigate("/pwclab/share-card")}
          style={{ height: 48, border: "1px solid #252525", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, cursor: "pointer" }}
        >
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase" }}>Share run card</div>
        </div>
      </div>
    </Screen>
  );
};

export default RideReport;
