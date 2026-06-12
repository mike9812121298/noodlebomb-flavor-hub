import { useNavigate } from "react-router-dom";
import { MONO, Screen, primaryGradient } from "../ui";

const NavigateMap = () => {
  const navigate = useNavigate();

  return (
    <Screen tab="ride">
      {/* Full-bleed map */}
      <svg
        viewBox="0 0 390 770"
        preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% - 74px)" }}
      >
        <defs>
          <radialGradient id="navWater" cx="50%" cy="45%" r="90%">
            <stop offset="0%" stopColor="#17597A" />
            <stop offset="55%" stopColor="#0F405C" />
            <stop offset="100%" stopColor="#0A2E44" />
          </radialGradient>
          <linearGradient id="navLand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94835A" />
            <stop offset="100%" stopColor="#74633D" />
          </linearGradient>
          <filter id="navTex" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <filter id="navTerr" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={4} result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect x="0" y="0" width="390" height="770" fill="url(#navWater)" />
        <rect x="0" y="0" width="390" height="770" fill="#ffffff" filter="url(#navTex)" opacity="0.04" />
        <ellipse cx="230" cy="420" rx="170" ry="180" fill="#7FB7CC" opacity="0.05" />
        <path
          d="M0 0 L0 380 C24 370 30 340 22 310 C14 278 36 260 52 238 C70 214 56 184 64 156 C72 126 50 104 58 72 C64 46 48 20 52 0 Z M390 0 L390 240 C366 246 356 222 360 196 C364 168 344 156 338 132 C330 102 350 84 344 56 C340 32 354 14 358 0 Z M150 0 C146 18 132 26 138 44 C144 62 168 58 180 44 C192 30 186 10 182 0 Z"
          fill="none"
          stroke="#5FA8C2"
          strokeWidth="8"
          opacity="0.28"
        />
        <path
          d="M0 0 L0 380 C24 370 30 340 22 310 C14 278 36 260 52 238 C70 214 56 184 64 156 C72 126 50 104 58 72 C64 46 48 20 52 0 Z"
          fill="url(#navLand)"
        />
        <path
          d="M390 0 L390 240 C366 246 356 222 360 196 C364 168 344 156 338 132 C330 102 350 84 344 56 C340 32 354 14 358 0 Z"
          fill="url(#navLand)"
        />
        <path d="M150 0 C146 18 132 26 138 44 C144 62 168 58 180 44 C192 30 186 10 182 0 Z" fill="url(#navLand)" />
        <g opacity="0.3">
          <path
            d="M0 0 L0 380 C24 370 30 340 22 310 C14 278 36 260 52 238 C70 214 56 184 64 156 C72 126 50 104 58 72 C64 46 48 20 52 0 Z"
            fill="#3A2F1A"
            filter="url(#navTerr)"
          />
          <path
            d="M390 0 L390 240 C366 246 356 222 360 196 C364 168 344 156 338 132 C330 102 350 84 344 56 C340 32 354 14 358 0 Z"
            fill="#3A2F1A"
            filter="url(#navTerr)"
          />
        </g>
        <ellipse cx="30" cy="120" rx="22" ry="40" fill="#4F6238" opacity="0.75" />
        <ellipse cx="36" cy="280" rx="18" ry="34" fill="#4F6238" opacity="0.6" />
        <ellipse cx="368" cy="90" rx="16" ry="36" fill="#4F6238" opacity="0.7" />
        <ellipse cx="162" cy="20" rx="14" ry="10" fill="#586D3E" opacity="0.6" />
        <path
          d="M0 380 C24 370 30 340 22 310 C14 278 36 260 52 238 C70 214 56 184 64 156 C72 126 50 104 58 72 C64 46 48 20 52 0 M390 240 C366 246 356 222 360 196 C364 168 344 156 338 132 C330 102 350 84 344 56 C340 32 354 14 358 0 M150 0 C146 18 132 26 138 44 C144 62 168 58 180 44 C192 30 186 10 182 0"
          fill="none"
          stroke="#E8D8A8"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <path
          d="M110 520 C170 500 250 530 330 480 M90 640 C170 610 270 650 360 590 M120 300 C180 280 260 310 340 270"
          stroke="#2D7A99"
          strokeWidth="1"
          fill="none"
          opacity="0.28"
        />
        <text x="285" y="540" fill="#7FB7CC" fontFamily="JetBrains Mono, monospace" fontSize="8" opacity="0.55">
          48 FT
        </text>
        <text x="120" y="620" fill="#7FB7CC" fontFamily="JetBrains Mono, monospace" fontSize="8" opacity="0.55">
          61 FT
        </text>
        <path d="M58 300 L96 290 M62 318 L100 308 M66 336 L104 326 M70 354 L108 344" stroke="#FFC53D" strokeWidth="1.5" opacity="0.4" />
        <path
          d="M52 286 C70 282 92 280 102 288 L110 348 C94 358 74 360 60 356 Z"
          fill="none"
          stroke="#FFC53D"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <text x="64" y="376" fill="#FFC53D" fontFamily="JetBrains Mono, monospace" fontSize="7.5" opacity="0.8">
          NO WAKE 5
        </text>
        <path d="M262 442 L269 454 L255 454 Z" fill="#E0492F" stroke="#fff" strokeWidth="1" />
        <text x="274" y="452" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="7" opacity="0.8">
          N2
        </text>
        <rect x="148" y="556" width="11" height="11" fill="#2FA45B" stroke="#fff" strokeWidth="1" />
        <text x="164" y="565" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="7" opacity="0.8">
          C1
        </text>
        <path
          d="M195 656 C200 560 160 480 200 380 C236 290 220 200 252 128"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path d="M195 656 C200 560 160 480 200 380 C236 290 220 200 252 128" fill="none" stroke="#E10600" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M186 488 L181 474 L194 478 M210 330 L208 315 L221 322"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <circle cx="252" cy="128" r="7" fill="#E10600" />
        <circle cx="252" cy="128" r="13" fill="none" stroke="#E10600" strokeOpacity="0.4" strokeWidth="2" />
        <circle cx="195" cy="656" r="22" fill="rgba(225,6,0,0.18)" />
        <circle cx="195" cy="656" r="11" fill="#FFFFFF" />
        <path d="M195 649 L200 660 L195 657.5 L190 660 Z" fill="#E10600" />
      </svg>
      {/* Top overlays */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 0 14px" }}>
        <div
          onClick={() => navigate("/pwclab/ride")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M14.5 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-6.5-5.5-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.5 12 21 12 21z"
              stroke="#E10600"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", lineHeight: 1.2 }}>
              Navigating to
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>Copper Cove</div>
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l3.5 8.5L12 10l-3.5 1.5L12 3z" fill="#E10600" />
            <path d="M12 21l-3.5-8.5L12 14l3.5-1.5L12 21z" fill="#8A8A8A" />
          </svg>
          <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 7.5, marginTop: 1 }}>NW</div>
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", padding: "8px 0 0 14px" }}>
        <div style={{ height: 22, padding: "0 8px", borderRadius: 6, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3DDC84" }} />
          <div style={{ fontFamily: MONO, color: "#B5B5B5", fontSize: 9, letterSpacing: 0.8 }}>±2.1 M · 13 SATS</div>
        </div>
      </div>
      {/* Bottom telemetry */}
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 88,
          background: "rgba(0,0,0,0.78)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "13px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 27, lineHeight: 1 }}>46.8</div>
            <div style={{ color: "#E10600", fontSize: 9.5, fontWeight: 700 }}>MPH</div>
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>Speed</div>
        </div>
        <div style={{ width: 1, height: 34, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: 1.2 }}>3.2</div>
            <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 700 }}>MI</div>
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>To go</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: 1.2 }}>4</div>
            <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 700 }}>MIN</div>
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>ETA</div>
        </div>
        <div
          onClick={() => navigate("/pwclab/ride/report")}
          style={{
            marginLeft: "auto",
            height: 44,
            padding: "0 18px",
            background: primaryGradient,
            borderRadius: 11,
            border: "1px solid #FF3B2B",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase" }}>End</div>
        </div>
      </div>
    </Screen>
  );
};

export default NavigateMap;
