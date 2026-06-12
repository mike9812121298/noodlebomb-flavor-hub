import { Screen, ScreenHeader, MONO, cardStyle } from "../ui";
import { maintenanceSchedule } from "../data";

const Maintenance = () => {
  return (
    <Screen tab="garage">
      <ScreenHeader
        title="Maintenance"
        backTo="/pwclab/garage"
        right={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Engine hours</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24 }}>52.3</div>
          </div>
          <div style={{ fontFamily: MONO, color: "#555", fontSize: 10, textAlign: "right", lineHeight: 1.6 }}>
            logged automatically
            <br />
            from your rides
          </div>
        </div>
        <div
          style={{
            background: "#111",
            border: "1px solid rgba(255,197,61,0.35)",
            borderRadius: 14,
            padding: "15px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ color: "#FFC53D", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>Next service</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 24,
                padding: "0 9px",
                borderRadius: 999,
                background: "rgba(255,197,61,0.1)",
                border: "1px solid rgba(255,197,61,0.35)",
                color: "#FFC53D",
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              Due soon
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Oil &amp; filter change</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#FFC53D" }}>14.7</div>
              <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 700 }}>ENGINE HRS</div>
            </div>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "#252525", overflow: "hidden" }}>
            <div style={{ width: "71%", height: "100%", background: "#FFC53D", borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>every 50 hrs · last at 17.0</div>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>35.3 / 50 hrs</div>
          </div>
          <div
            style={{
              height: 46,
              border: "1px solid #252525",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 2,
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase" }}>Mark as done</div>
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
            Service schedule
          </div>
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
            {maintenanceSchedule.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom: i < maintenanceSchedule.length - 1 ? "1px solid #1E1E1E" : undefined,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontFamily: MONO, color: item.dueColor, fontSize: 11, marginTop: 1 }}>{item.due}</div>
                </div>
                {item.done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4 10-11" stroke="#3DDC84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div
                    style={{
                      height: 34,
                      padding: "0 16px",
                      border: "1px solid #252525",
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default Maintenance;
