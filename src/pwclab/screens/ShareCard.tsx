import { Screen, ScreenHeader, PrimaryButton, Wordmark, MONO } from "../ui";

export default function ShareCard() {
  return (
    <Screen>
      <ScreenHeader title="Share run card" backTo="/pwclab/ride/report" />
      <div
        className="pwl-scroll"
        style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, minHeight: 0 }}
      >
        <div
          style={{
            width: 340,
            height: 425,
            background: "#000",
            borderRadius: 20,
            boxShadow: "0 28px 64px rgba(0,0,0,0.26), 0 3px 10px rgba(0,0,0,0.14)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 90% 55% at 50% 62%, rgba(225,6,0,0.16) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0 20px" }}>
            <Wordmark size={17} />
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
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3DDC84" }} />
              <div style={{ color: "#3DDC84", fontSize: 10, fontWeight: 600 }}>GPS verified</div>
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 88, lineHeight: 1, color: "#fff" }}>81.4</div>
            </div>
            <div style={{ color: "#E10600", fontSize: 15, fontWeight: 700, letterSpacing: 5, marginTop: 2 }}>MPH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>2024 RXP-X 325</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 22,
                  padding: "0 9px",
                  borderRadius: 999,
                  background: "#1B1B1B",
                  border: "1px solid #252525",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                STAGE 2
              </div>
            </div>
            <div style={{ fontFamily: MONO, color: "#8A8A8A", fontSize: 11.5, marginTop: 6 }}>RANK #7 OF 142 · LAKE TAPPS, WA</div>
            <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>MAY 18, 2024</div>
          </div>
          <div style={{ position: "relative", height: 40, background: "#E10600", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{ color: "#fff", fontSize: 11.5, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>PWC Lab verified run</div>
          </div>
        </div>

        <PrimaryButton height={48} style={{ width: 340, flexShrink: 0 }}>
          Share
        </PrimaryButton>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10 }}>Exports 1080 × 1350 (4:5)</div>
      </div>
    </Screen>
  );
}
