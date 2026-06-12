import { useState } from "react";
import { Screen, ScreenHeader, Sheet, MONO, cardStyle, primaryGradient } from "../ui";
import { products, GT40_URL } from "../data";

const fitmentChips = ["Wrong model", "Wrong year", "Already installed", "Doesn't fit my ski", "Other"];

const similarBuilds = [
  { build: "RXP-X 325 · Stage 2", who: "Mike M. · verified May 12", gain: "+1.8" },
  { build: "RXP-X 325 · Stage 2", who: "Jason P. · verified May 2", gain: "+1.7" },
  { build: "RXT-X 300 · Stage 2", who: "Chris R. · verified Apr 19", gain: "+1.4" },
];

const TestData = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState(0);

  return (
    <Screen>
      <ScreenHeader title="Test data" backTo="/pwclab/garage/upgrade-path" />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ ...cardStyle, padding: "12px 14px", display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 54, height: 54, borderRadius: 9, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
            <img src={products.intercooler.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Intercooler" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>GT40 Intercooler</div>
            <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 10.5 }}>FITS 2018+ RXP-X / RXT-X 300–325</div>
          </div>
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
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ color: "#3DDC84", fontSize: 10.5, fontWeight: 600 }}>Fits your ski</div>
          </div>
        </div>
        <div style={{ ...cardStyle, padding: "15px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Verified results</div>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>184 BUILDS · GPS LOGGED</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#3DDC84", lineHeight: 1 }}>+1.6</div>
            <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>MPH AVG GAIN</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 52, color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Before</div>
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: "#1B1B1B", overflow: "hidden" }}>
                <div style={{ width: "53%", height: "100%", background: "#3A3A3A", borderRadius: 7 }} />
              </div>
              <div style={{ width: 38, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "#8A8A8A", textAlign: "right" }}>81.2</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 52, color: "#8A8A8A", fontSize: 9.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>After</div>
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: "#1B1B1B", overflow: "hidden" }}>
                <div style={{ width: "80%", height: "100%", background: "linear-gradient(90deg, #7A0300, #E10600)", borderRadius: 7 }} />
              </div>
              <div style={{ width: 38, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "right" }}>82.8</div>
            </div>
          </div>
          <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>92% of builds gained ≥1.0 mph · scale 78–84 mph</div>
        </div>
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "11px 16px 9px 16px",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              borderBottom: "1px solid #1E1E1E",
            }}
          >
            Builds like yours
          </div>
          {similarBuilds.map((row, i) => (
            <div
              key={row.who}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: i < similarBuilds.length - 1 ? "1px solid #1E1E1E" : undefined,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{row.build}</div>
                <div style={{ color: "#8A8A8A", fontSize: 10.5 }}>{row.who}</div>
              </div>
              <div style={{ fontFamily: MONO, color: "#3DDC84", fontSize: 13, fontWeight: 700 }}>{row.gain}</div>
            </div>
          ))}
        </div>
        <div style={{ ...cardStyle, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>
              Install difficulty
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {["#FFC53D", "#FFC53D", "#252525", "#252525"].map((c, i) => (
                  <div key={i} style={{ width: 16, height: 6, borderRadius: 2, background: c }} />
                ))}
              </div>
              <div style={{ color: "#FFC53D", fontSize: 12, fontWeight: 600 }}>Medium</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Est. install</div>
            <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700 }}>2.5 hrs</div>
          </div>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 14, display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div
            onClick={() => window.open(GT40_URL, "_blank")}
            style={{
              height: 56,
              background: primaryGradient,
              borderRadius: 14,
              border: "1px solid #FF3B2B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 26px rgba(225,6,0,0.3)",
              cursor: "pointer",
            }}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase" }}>Buy from GT40 Marine</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>Opens gt40marine.com · no in-app purchase</div>
            <div
              onClick={() => setReportOpen(true)}
              style={{
                color: "#FFC53D",
                fontSize: 11,
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 2,
                cursor: "pointer",
              }}
            >
              Report fitment issue
            </div>
          </div>
        </div>
      </div>
      <Sheet open={reportOpen} onClose={() => setReportOpen(false)}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>What looks wrong?</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {fitmentChips.map((chip, i) => {
            const active = i === selectedChip;
            return (
              <div
                key={chip}
                onClick={() => setSelectedChip(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 30,
                  padding: "0 12px",
                  borderRadius: 999,
                  background: active ? "rgba(255,197,61,0.1)" : "#111",
                  border: active ? "1px solid #FFC53D" : "1px solid #272727",
                  color: active ? "#FFC53D" : "#8A8A8A",
                  fontSize: 11.5,
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: 58,
            background: "#111",
            border: "1px solid #272727",
            borderRadius: 11,
            padding: "10px 13px",
            color: "#555",
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          Optional note…
        </div>
        <div
          onClick={() => setReportOpen(false)}
          style={{
            height: 44,
            border: "1px solid #FFC53D",
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFC53D",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Send report
        </div>
      </Sheet>
    </Screen>
  );
};

export default TestData;
