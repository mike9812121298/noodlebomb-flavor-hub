import { Screen, ScreenHeader, MONO, cardStyle, ChevronRight } from "../ui";
import { products } from "../data";

const causes = ["Faulty throttle position sensor", "Loose or corroded connector", "Wiring harness damage"];

const AiMechanic = () => {
  return (
    <Screen tab="garage">
      <ScreenHeader
        title="AI Mechanic"
        backTo="/pwclab/garage"
        right={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4l2.5 2.5" stroke="#8A8A8A" strokeWidth="1.7" strokeLinecap="round" />
            <path
              d="M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12H2.8M4.5 12l-1.8 2"
              stroke="#8A8A8A"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div style={{ ...cardStyle, padding: "15px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Fault code</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: "#E10600", lineHeight: 1 }}>P1505</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 24,
                padding: "0 10px",
                borderRadius: 999,
                background: "#1B1B1B",
                border: "1px solid #252525",
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              Sea-Doo · Throttle
            </div>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>read May 19, 2024</div>
          </div>
        </div>
        <div style={{ ...cardStyle, padding: "15px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Issue</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Throttle body fault</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Common causes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {causes.map((cause) => (
                <div key={cause} style={{ display: "flex", gap: 9, alignItems: "baseline" }}>
                  <div style={{ width: 10, height: 2, background: "#E10600", flexShrink: 0, transform: "translateY(-3px)" }} />
                  <div style={{ color: "#CFCFCF", fontSize: 13.5, lineHeight: 1.45 }}>{cause}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px solid #1E1E1E", paddingTop: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Difficulty</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {["#FFC53D", "#FFC53D", "#252525", "#252525"].map((c, i) => (
                    <div key={i} style={{ width: 16, height: 6, borderRadius: 2, background: c }} />
                  ))}
                </div>
                <div style={{ color: "#FFC53D", fontSize: 12, fontWeight: 600 }}>Medium</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Estimated cost</div>
              <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700 }}>$150–$300</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, borderTop: "1px solid #1E1E1E", paddingTop: 12 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase" }}>Recommended fix</div>
            <div style={{ color: "#CFCFCF", fontSize: 13.5, lineHeight: 1.5 }}>
              Inspect the connector and wiring first — most P1505s clear after reseating the TPS plug. Replace the sensor only if the fault
              returns.
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
            Fits this fix
          </div>
          <div style={{ ...cardStyle, borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
              <img src={products.serviceKit.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Service kit" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Throttle body service kit</div>
              <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 11.5 }}>$129</div>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 12, flexShrink: 0 }}>
          <div
            style={{
              height: 52,
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 8px 0 16px",
            }}
          >
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 13, flex: 1 }}>Enter a fault code…</div>
            <div
              style={{
                width: 38,
                height: 38,
                background: "#E10600",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default AiMechanic;
