import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, MONO, cardStyle, redTintCardStyle, primaryGradient } from "../ui";
import { products, GT40_URL } from "../data";

const savedParts = [
  { name: "GT40 Intercooler", img: products.intercooler.img, gain: "+1.6 MPH", conf: "CONF. 92%" },
  { name: "GT40 Rear Exhaust", img: products.rearExhaust.img, gain: "+0.8 MPH", conf: "CONF. 89%" },
];

const BuildPlan = () => {
  const navigate = useNavigate();

  return (
    <Screen tab="garage">
      <ScreenHeader title="My build plan" backTo="/pwclab/garage/upgrade-path" />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div
          style={{
            ...redTintCardStyle,
            borderRadius: 13,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>
              If you install everything
            </div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>81.4 today</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 25, color: "#FF453A" }}>83.8</div>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 700 }}>MPH PROJ.</div>
          </div>
        </div>
        {savedParts.map((part) => (
          <div key={part.name} style={{ ...cardStyle, padding: "13px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 9, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
                <img src={part.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={part.name} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{part.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: MONO, color: "#3DDC84", fontSize: 11.5, fontWeight: 700 }}>{part.gain}</div>
                  <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5 }}>{part.conf}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div style={{ color: "#3DDC84", fontSize: 9.5, fontWeight: 600 }}>Fits</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 9px",
                  borderRadius: 999,
                  background: "#1B1B1B",
                  border: "1px solid #2E2E2E",
                  color: "#CFCFCF",
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                SAVED
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                onClick={() => navigate("/pwclab/test-data")}
                style={{
                  flex: 1.2,
                  height: 38,
                  border: "1px solid #272727",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                View test data
              </div>
              <div
                onClick={() => window.open(GT40_URL, "_blank")}
                style={{
                  flex: 1.2,
                  height: 38,
                  background: primaryGradient,
                  border: "1px solid #FF3B2B",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Buy from GT40
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  border: "1px solid #272727",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 7h14M10 7V5h4v2M8 7l1 13h6l1-13" stroke="#8A8A8A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        ))}
        <div style={{ ...cardStyle, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 9, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
            <img src={products.catchCan.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Maintenance kit" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>GT40 Maintenance Kit</div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>Ordered May 20 · arriving Thu</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 24,
              padding: "0 9px",
              borderRadius: 999,
              background: "rgba(62,168,239,0.1)",
              border: "1px solid rgba(62,168,239,0.4)",
              color: "#3EA8EF",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: 0.8,
            }}
          >
            PURCHASED
          </div>
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>
          Saved → purchased → installed. Installed parts move to My Mods and prompt a verification run.
        </div>
        <div
          onClick={() => navigate("/pwclab/garage/upgrade-path")}
          style={{
            border: "1px dashed #2A2A2A",
            borderRadius: 12,
            padding: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: "auto",
            marginBottom: 14,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ color: "#8A8A8A", fontSize: 12.5, fontWeight: 600 }}>Browse upgrade path</div>
        </div>
      </div>
    </Screen>
  );
};

export default BuildPlan;
