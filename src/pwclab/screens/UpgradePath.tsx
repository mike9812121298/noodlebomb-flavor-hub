import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, Sheet, MONO, cardStyle, primaryGradient, ChevronRight, ChevronDown } from "../ui";
import { ski, products, GT40_URL } from "../data";

const UpgradePath = () => {
  const navigate = useNavigate();
  const [installedOpen, setInstalledOpen] = useState(false);

  return (
    <Screen tab="garage">
      <ScreenHeader
        title="Upgrade path"
        backTo="/pwclab/garage"
        right={
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/pwclab/build-compare")}
          >
            <circle cx="12" cy="12" r="8.5" stroke="#8A8A8A" strokeWidth="1.7" />
            <path d="M12 11v5" stroke="#8A8A8A" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1.1" fill="#8A8A8A" />
          </svg>
        }
      />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #252525", background: "#111", flexShrink: 0 }}>
          <img src={ski.photo} alt="2024 RXP-X 325" style={{ width: "100%", height: 118, objectFit: "cover", display: "block" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 14px",
              borderTop: "1px solid #252525",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>
                2024 RXP-X 325 · current top speed
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 23 }}>81.4</div>
                <div style={{ color: "#E10600", fontSize: 10.5, fontWeight: 700 }}>MPH</div>
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
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
            Recommended next upgrade
          </div>
          <div style={{ ...cardStyle, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: 10, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
                <img src={products.intercooler.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Intercooler" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>GT40 Intercooler</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Expected gain</div>
                  <div style={{ fontFamily: MONO, color: "#3DDC84", fontSize: 14, fontWeight: 700 }}>+1.6 MPH</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Confidence</div>
                  <div style={{ flex: 1, maxWidth: 80, height: 5, borderRadius: 3, background: "#252525", overflow: "hidden" }}>
                    <div style={{ width: "92%", height: "100%", background: "#3DDC84" }} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "#fff" }}>92%</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1E1E1E", paddingTop: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Verified builds</div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#fff" }}>184</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>
                  Avg before → after
                </div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#fff" }}>81.2 → 82.8</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ color: "#8A8A8A", fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Install</div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#FFC53D" }}>Medium</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                onClick={() => navigate("/pwclab/test-data")}
                style={{
                  flex: 1.3,
                  height: 50,
                  background: primaryGradient,
                  borderRadius: 12,
                  border: "1px solid #FF3B2B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13.5,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                View test data
              </div>
              <div
                onClick={() => window.open(GT40_URL, "_blank")}
                style={{
                  flex: 1,
                  height: 50,
                  border: "1px solid #252525",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12.5,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Buy from GT40
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <div
                onClick={() => navigate("/pwclab/garage/build-plan")}
                style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4h12v16l-6-4-6 4V4z" stroke="#8A8A8A" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                <div style={{ color: "#8A8A8A", fontSize: 11.5, fontWeight: 600 }}>Save to build plan</div>
              </div>
              <div style={{ width: 1, height: 12, background: "#252525" }} />
              <div onClick={() => setInstalledOpen(true)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4 10-11" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ color: "#8A8A8A", fontSize: 11.5, fontWeight: 600 }}>Already installed</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
            After that
          </div>
          <div style={{ ...cardStyle, borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
              <img src={products.rearExhaust.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Exhaust" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>GT40 Rear Exhaust</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <div style={{ fontFamily: MONO, color: "#3DDC84", fontSize: 12, fontWeight: 700 }}>+0.8 MPH</div>
                <div style={{ color: "#555", fontSize: 10.5 }}>conf. 89%</div>
              </div>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div
          style={{
            ...cardStyle,
            borderRadius: 12,
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Projected top speed</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 23, color: "#E10600" }}>83.8</div>
            <div style={{ color: "#8A8A8A", fontSize: 10.5, fontWeight: 700 }}>MPH</div>
          </div>
        </div>
      </div>
      <Sheet open={installedOpen} onClose={() => setInstalledOpen(false)}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Already installed?</div>
        <div style={{ color: "#8A8A8A", fontSize: 12, lineHeight: 1.5 }}>
          GT40 Intercooler moves to My Mods and out of your recommendations.
        </div>
        <div
          style={{
            height: 44,
            background: "#111",
            border: "1px solid #272727",
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 13px",
            flexShrink: 0,
          }}
        >
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Install date — May 2024</div>
          <ChevronDown size={11} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            onClick={() => navigate("/pwclab/speed-run")}
            style={{
              flex: 1.3,
              height: 44,
              background: primaryGradient,
              border: "1px solid #FF3B2B",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11.5,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Verify with a run
          </div>
          <div
            onClick={() => navigate("/pwclab/garage/mods")}
            style={{
              flex: 1,
              height: 44,
              border: "1px solid #272727",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 11.5,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Just add it
          </div>
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5 }}>Verify = before/after speed run → gain shows on My Mods.</div>
      </Sheet>
    </Screen>
  );
};

export default UpgradePath;
