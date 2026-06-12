import { CSSProperties, ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen, PrimaryButton, BackArrow, ChevronDown, PinIcon, cardStyle, MONO, EASE } from "../ui";
import { onboardingParts } from "../data";

/* ---------- shared step chrome ---------- */

const titleStyle: CSSProperties = {
  fontSize: 27,
  fontWeight: 800,
  lineHeight: 1.15,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  animation: `pwlRiseIn 0.6s ${EASE} 0.12s both`,
};

const subStyle: CSSProperties = {
  color: "#8A8A8A",
  fontSize: 14,
  lineHeight: 1.5,
  animation: `pwlRiseIn 0.6s ${EASE} 0.24s both`,
};

const labelStyle: CSSProperties = {
  color: "#8A8A8A",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
};

const fieldStyle: CSSProperties = {
  ...cardStyle,
  borderRadius: 12,
  height: 54,
  animation: `pwlRiseIn 0.6s ${EASE} 0.34s both`,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
};

const ctaAnimation = `pwlRiseIn 0.6s ${EASE} 0.45s both, pwlCtaGlow 3.5s ease-in-out 1.8s infinite`;

function StepHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <>
      <div
        style={{
          height: 58,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div onClick={onBack} style={{ cursor: "pointer", display: "flex" }}>
          <BackArrow />
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 11, animation: "pwlFadeIn 0.8s ease-out 0.2s both" }}>
          {step} / 6
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0 16px", flexShrink: 0 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: n <= step ? "#E10600" : "#252525",
              ...(n <= step
                ? { transformOrigin: "left", animation: `pwlSegFill 0.55s ${EASE} both` }
                : {}),
            }}
          />
        ))}
      </div>
    </>
  );
}

function StepContent({ children, scroll }: { children: ReactNode; scroll?: boolean }) {
  return (
    <div
      className={scroll ? "pwl-scroll" : undefined}
      style={{
        flex: 1,
        padding: "28px 24px 0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 0,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- step 1: your ski ---------- */

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={labelStyle}>{label}</div>
      <div style={{ ...fieldStyle, justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{value}</div>
        <ChevronDown size={13} />
      </div>
    </div>
  );
}

function StepYourSki({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <StepContent>
        <div style={titleStyle}>
          What do
          <br />
          you ride?
        </div>
        <div style={{ ...subStyle, marginBottom: 8 }}>
          We'll match parts, leaderboards, and service intervals to your exact ski.
        </div>
        <SelectField label="Brand" value="Sea-Doo" />
        <SelectField label="Model" value="RXP-X 325" />
        <SelectField label="Year" value="2024" />
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10.5 }}>
          Yamaha riders: full WaveRunner support too.
        </div>
      </StepContent>
      <div style={{ padding: "0 24px 32px 24px", flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} style={{ animation: ctaAnimation }}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}

/* ---------- step 2: build ---------- */

function deriveStage(count: number) {
  if (count >= 6) return "STAGE 2";
  if (count >= 3) return "STAGE 1+";
  if (count >= 1) return "STAGE 1";
  return "STOCK";
}

function StepBuild({ onContinue }: { onContinue: () => void }) {
  const [parts, setParts] = useState(() => onboardingParts.map((p) => ({ ...p })));
  const checkedCount = parts.filter((p) => p.checked).length;
  const toggle = (i: number) =>
    setParts((prev) => prev.map((p, idx) => (idx === i ? { ...p, checked: !p.checked } : p)));

  return (
    <>
      <StepContent scroll>
        <div style={titleStyle}>How's it built?</div>
        <div style={{ ...subStyle, marginBottom: 6 }}>
          Check the performance parts on your ski — we'll class your build for the boards.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {parts.map((p, i) => (
            <div
              key={p.name}
              onClick={() => toggle(i)}
              style={{
                border: "1px solid #252525",
                background: "#111",
                borderRadius: 10,
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 11,
                cursor: "pointer",
                animation: `pwlSlideIn 0.5s ${EASE} 0.3s both`,
              }}
            >
              {p.checked ? (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: "#E10600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    animation: `pwlCheckPop 0.45s ${EASE} 0.5s both`,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4 10-11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: 6, border: "1.5px solid #555", flexShrink: 0 }} />
              )}
              <div
                style={{
                  flex: 1,
                  fontSize: 13.5,
                  fontWeight: p.checked ? 700 : 600,
                  color: p.checked ? "#fff" : "#CFCFCF",
                }}
              >
                {p.name}
              </div>
              <div style={{ fontFamily: MONO, color: "#555", fontSize: 9, letterSpacing: 1 }}>{p.tag}</div>
            </div>
          ))}
          <div
            style={{
              border: "1px dashed #2A2A2A",
              borderRadius: 10,
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              cursor: "pointer",
              animation: `pwlSlideIn 0.5s ${EASE} 0.42s both`,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div style={{ color: "#8A8A8A", fontSize: 12, fontWeight: 600 }}>Add another part</div>
          </div>
        </div>
        <div
          style={{
            background: "#170808",
            border: "1px solid #7A0300",
            borderRadius: 12,
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: `pwlRiseIn 0.6s ${EASE} 0.6s both`,
          }}
        >
          <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>
            Your build classes as
          </div>
          <div style={{ fontFamily: MONO, color: "#E10600", fontSize: 16, fontWeight: 800 }}>
            {deriveStage(checkedCount)}
          </div>
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10.5 }}>
          Stage is auto-classed from your parts — edit anytime in Garage.
        </div>
      </StepContent>
      <div style={{ padding: "0 24px 32px 24px", flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} style={{ animation: ctaAnimation }}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}

/* ---------- step 3: goal ---------- */

const goals = [
  { glyph: "MPH", title: "Top speed", sub: "Chase the number", delay: 0.32 },
  { glyph: "0–50", title: "Acceleration", sub: "Launch harder", delay: 0.42 },
  { glyph: "HRS", title: "Reliability", sub: "Run it forever", delay: 0.42 },
  { glyph: "GPS", title: "Just tracking", sub: "Log my rides", delay: 0.42 },
];

function StepGoal({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <StepContent>
        <div style={titleStyle}>What's the goal?</div>
        <div style={{ ...subStyle, marginBottom: 8 }}>Shapes your home screen and what we recommend first.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {goals.map((g, i) => {
            const active = selected === i;
            return (
              <div
                key={g.glyph}
                onClick={() => setSelected(i)}
                style={{
                  border: active ? "2px solid #E10600" : "1px solid #252525",
                  background: active ? "#170808" : "#111",
                  borderRadius: 14,
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minHeight: 104,
                  cursor: "pointer",
                  animation: `pwlRiseIn 0.6s ${EASE} ${g.delay}s both`,
                }}
              >
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: active ? "#E10600" : "#8A8A8A" }}>
                  {g.glyph}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</div>
                <div style={{ color: "#8A8A8A", fontSize: 11.5, lineHeight: 1.4 }}>{g.sub}</div>
              </div>
            );
          })}
        </div>
      </StepContent>
      <div style={{ padding: "0 24px 32px 24px", flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} style={{ animation: ctaAnimation }}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}

/* ---------- step 4: home waters ---------- */

function StepHomeWaters({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const [multiple, setMultiple] = useState(false);
  return (
    <>
      <StepContent>
        <div style={titleStyle}>
          Where do
          <br />
          you ride?
        </div>
        <div style={{ ...subStyle, marginBottom: 8 }}>
          Powers local leaderboards, lake records, and group rides near you.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={labelStyle}>Home waters</div>
          <div style={{ ...fieldStyle, gap: 10 }}>
            <PinIcon size={16} color="#8A8A8A" strokeWidth={1.7} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Lake Tapps</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={labelStyle}>State</div>
          <div style={{ ...fieldStyle, justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Washington</div>
            <ChevronDown size={13} />
          </div>
        </div>
        <div
          onClick={() => setMultiple((m) => !m)}
          style={{
            border: "1px solid #252525",
            background: "#111",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          {multiple ? (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: "#E10600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4 10-11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: 6, border: "1.5px solid #555", flexShrink: 0 }} />
          )}
          <div style={{ fontSize: 14, fontWeight: 600, color: "#CFCFCF" }}>I ride multiple places</div>
        </div>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 10.5 }}>
          Only your lake name is shown on local boards — never your live position.
        </div>
      </StepContent>
      <div style={{ padding: "0 24px 32px 24px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} style={{ animation: ctaAnimation }}>
          Continue
        </PrimaryButton>
        <div
          onClick={onSkip}
          style={{ textAlign: "center", color: "#8A8A8A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Skip for now
        </div>
      </div>
    </>
  );
}

/* ---------- step 5: account ---------- */

function StepAccount({ onDone }: { onDone: () => void }) {
  return (
    <>
      <StepContent>
        <div style={titleStyle}>Claim your spot</div>
        <div style={{ ...subStyle, marginBottom: 8 }}>Your name on the board, your runs under your belt.</div>
        <div style={fieldStyle}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            Jake R.
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 16,
                background: "#E10600",
                marginLeft: 3,
                verticalAlign: -2,
                animation: "pwlCaret 1.1s step-end infinite",
              }}
            />
          </div>
        </div>
        <div style={fieldStyle}>
          <div style={{ fontSize: 15, color: "#555" }}>Email</div>
        </div>
        <div style={{ ...fieldStyle, justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, color: "#555" }}>Password</div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" stroke="#555" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="2.6" stroke="#555" strokeWidth="1.6" />
          </svg>
        </div>
        <PrimaryButton
          onClick={onDone}
          style={{ marginTop: 6, animation: `pwlRiseIn 0.6s ${EASE} 0.5s both, pwlCtaGlow 3.5s ease-in-out 1.8s infinite` }}
        >
          Create account
        </PrimaryButton>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#1E1E1E" }} />
          <div style={{ color: "#555", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>OR</div>
          <div style={{ flex: 1, height: 1, background: "#1E1E1E" }} />
        </div>
        <div
          onClick={onDone}
          style={{
            height: 54,
            border: "1px solid #252525",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            cursor: "pointer",
            animation: `pwlRiseIn 0.6s ${EASE} 0.62s both`,
          }}
        >
          <svg width="16" height="19" viewBox="0 0 16 19" fill="#fff">
            <path
              d="M13.3 10.1c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9C3.4 4.6 1.8 5.6.9 7.2c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.9-1.4 1.3-2.8 1.4-2.8-.1-.1-2.6-1-2.6-4zM10.9 3.1c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"
              transform="scale(0.85)"
            />
          </svg>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Continue with Apple</div>
        </div>
        <div
          onClick={onDone}
          style={{
            height: 54,
            border: "1px solid #252525",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            cursor: "pointer",
            animation: `pwlRiseIn 0.6s ${EASE} 0.62s both`,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C36.9 40.4 44 35 44 24c0-1.3-.1-2.7-.4-3.9z"
            />
          </svg>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Continue with Google</div>
        </div>
      </StepContent>
      <div style={{ padding: "0 24px 32px 24px", flexShrink: 0 }}>
        <div style={{ fontFamily: MONO, color: "#444", fontSize: 9.5, textAlign: "center", lineHeight: 1.7 }}>
          By continuing you accept the Terms &amp; Privacy Policy.
        </div>
      </div>
    </>
  );
}

/* ---------- step 6: gps ---------- */

function StepGps({ onDone }: { onDone: () => void }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          minHeight: 0,
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", width: 150, height: 150 }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle
              cx="75"
              cy="75"
              r="66"
              fill="none"
              stroke="#1B1B1B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="311 415"
              transform="rotate(135 75 75)"
            />
            <circle
              cx="75"
              cy="75"
              r="66"
              fill="none"
              stroke="#E10600"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="218 415"
              transform="rotate(135 75 75)"
              style={{ animation: `pwlGpsArc 1.6s ${EASE} 0.4s both` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 64,
              height: 64,
              margin: "-32px 0 0 -32px",
              borderRadius: "50%",
              border: "2px solid rgba(225,6,0,0.5)",
              animation: `pwlPing 2.4s ${EASE} 1.6s infinite`,
            }}
          />
          <div style={{ position: "absolute", inset: -16, animation: "pwlOrbit 8s linear infinite" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: 6,
                height: 6,
                marginLeft: -3,
                borderRadius: "50%",
                background: "#3DDC84",
                boxShadow: "0 0 8px rgba(61,220,132,0.8)",
              }}
            />
          </div>
          <div style={{ position: "absolute", inset: -4, animation: "pwlOrbitRev 12s linear infinite" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: 4,
                height: 4,
                marginLeft: -2,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 0 6px rgba(255,255,255,0.5)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-6.5-5.5-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.5 12 21 12 21z"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10.8" r="2.4" stroke="#fff" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
        <div style={titleStyle}>GPS makes it official</div>
        <div
          style={{
            color: "#8A8A8A",
            fontSize: 14,
            lineHeight: 1.55,
            maxWidth: 290,
            animation: `pwlRiseIn 0.6s ${EASE} 0.3s both`,
          }}
        >
          Speed, distance, and every leaderboard run are measured by GPS — no GPS, no verified badge. Location is only
          tracked while you ride — your exact location is never shown publicly unless you choose to share it.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 26,
            padding: "0 10px",
            borderRadius: 999,
            background: "rgba(61,220,132,0.12)",
            border: "1px solid rgba(61,220,132,0.4)",
            animation: `pwlRiseIn 0.6s ${EASE} 0.42s both`,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3DDC84" }} />
          <div style={{ color: "#3DDC84", fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>
            Required for verified runs
          </div>
        </div>
      </div>
      <div style={{ padding: "0 24px 32px 24px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
        <PrimaryButton onClick={onDone} style={{ animation: ctaAnimation }}>
          Enable location
        </PrimaryButton>
        <div
          onClick={onDone}
          style={{ textAlign: "center", color: "#8A8A8A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Not now
        </div>
      </div>
    </>
  );
}

/* ---------- router ---------- */

const Onboarding = () => {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const step = Math.min(6, Math.max(1, parseInt(stepParam ?? "1", 10) || 1));

  const goBack = () => (step === 1 ? navigate("/pwclab/welcome") : navigate(`/pwclab/onboarding/${step - 1}`));
  const goNext = () => navigate(`/pwclab/onboarding/${step + 1}`);
  const goHome = () => navigate("/pwclab/home");

  return (
    <Screen key={step}>
      <StepHeader step={step} onBack={goBack} />
      {step === 1 && <StepYourSki onContinue={goNext} />}
      {step === 2 && <StepBuild onContinue={goNext} />}
      {step === 3 && <StepGoal onContinue={goNext} />}
      {step === 4 && <StepHomeWaters onContinue={goNext} onSkip={goNext} />}
      {step === 5 && <StepAccount onDone={() => navigate("/pwclab/onboarding/6")} />}
      {step === 6 && <StepGps onDone={goHome} />}
    </Screen>
  );
};

export default Onboarding;
