import { useNavigate } from "react-router-dom";
import { Screen, EASE } from "../ui";
import { ASSETS } from "../data";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Screen>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 210,
          lineHeight: 1,
          fontFamily: "'Chakra Petch', sans-serif",
          color: "rgba(255,255,255,0.03)",
          WebkitTextStroke: "1px rgba(255,255,255,0.07)",
          letterSpacing: -6,
          pointerEvents: "none",
          animation: `pwlGhostIn 1.4s ${EASE} both, pwlGhostDrift 9s ease-in-out 1.4s infinite`,
        }}
      >
        300
      </div>
      <div
        style={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 400,
          background: "radial-gradient(ellipse 52% 42% at 50% 52%, rgba(225,6,0,0.3) 0%, rgba(225,6,0,0) 70%)",
          pointerEvents: "none",
          animation: "pwlGlowPulse 5s ease-in-out 1s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 168,
          right: 0,
          width: 200,
          height: 2,
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 100%)",
          animation: `pwlStreak 3.2s ${EASE} 1.1s infinite`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 196,
          right: 0,
          width: 120,
          height: 2,
          background: "linear-gradient(90deg, rgba(225,6,0,0) 0%, rgba(255,69,58,0.45) 100%)",
          animation: `pwlStreak 3.2s ${EASE} 1.5s infinite`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 252,
          right: 0,
          width: 160,
          height: 2,
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 100%)",
          animation: `pwlStreak 3.2s ${EASE} 2.1s infinite`,
        }}
      />
      <img
        src={`${ASSETS}/ski-rxtx-yellow.png`}
        alt="Sea-Doo RXT-X RS"
        style={{
          position: "absolute",
          top: 64,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 480,
          maxWidth: "none",
          filter: "drop-shadow(0 34px 44px rgba(225,6,0,0.22))",
          animation: `pwlSkiIn 0.9s ${EASE} both, pwlSkiFloat 5s ease-in-out 0.9s infinite`,
        }}
      />
      <img
        src={`${ASSETS}/ski-rxtx-yellow.png`}
        alt=""
        style={{
          position: "absolute",
          top: 318,
          left: "50%",
          transform: "translateX(-50%) rotate(2deg) scaleY(-1)",
          width: 480,
          maxWidth: "none",
          opacity: 0.22,
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.9) 75%)",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.9) 75%)",
          animation: `pwlReflIn 0.9s ${EASE} both, pwlReflFloat 5s ease-in-out 0.9s infinite`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 56%, #000 74%)",
        }}
      />
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 24px 36px 24px",
          gap: 14,
        }}
      >
        <div
          style={{
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 46,
            lineHeight: 1,
            animation: `pwlRiseIn 0.6s ${EASE} 0.35s both`,
          }}
        >
          <span style={{ color: "#fff" }}>PWC</span>
          <span style={{ color: "#E10600" }}>&nbsp;LAB</span>
        </div>
        <div
          style={{
            fontSize: 21,
            fontWeight: 700,
            lineHeight: 1.25,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            animation: `pwlRiseIn 0.6s ${EASE} 0.5s both`,
          }}
        >
          Track every ride.
          <br />
          Prove every run.
        </div>
        <div
          style={{
            color: "#B5B5B5",
            fontSize: 14,
            lineHeight: 1.5,
            maxWidth: 300,
            animation: `pwlRiseIn 0.6s ${EASE} 0.62s both`,
          }}
        >
          GPS-verified speed runs, your build in one garage, and leaderboards that mean something.
        </div>
        <div
          onClick={() => navigate("/pwclab/onboarding/1")}
          style={{
            height: 56,
            background: "linear-gradient(180deg, #FF1B0B 0%, #C20500 100%)",
            borderRadius: 14,
            border: "1px solid #FF3B2B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            cursor: "pointer",
            animation: `pwlRiseIn 0.6s ${EASE} 0.78s both, pwlCtaGlow 3.5s ease-in-out 1.6s infinite`,
          }}
        >
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Get started
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#8A8A8A",
            fontSize: 13,
            paddingTop: 2,
            animation: `pwlRiseIn 0.6s ${EASE} 0.92s both`,
          }}
        >
          Already riding with us?{" "}
          <span onClick={() => navigate("/pwclab/home")} style={{ color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Sign in
          </span>
        </div>
      </div>
    </Screen>
  );
};

export default Welcome;
