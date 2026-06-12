import { useState } from "react";
import { Card, ChevronDown, MONO, PrimaryButton, Screen, ScreenHeader, Sheet, primaryGradient } from "../ui";

const fieldLabel = { color: "#8A8A8A", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" } as const;

const STYLE_CHIPS = ["Testing", "Cruising", "Racing", "Group ride", "Family ride"];
const VISIBILITY = ["1 hour", "3 hours", "Today"];
const WHO = [
  { label: "Friends only", suffix: null },
  { label: "Local riders", suffix: " — lake-level only, never exact GPS" },
  { label: "Private group", suffix: null },
];
const RIDE_STYLE_CHIPS = ["Cruise", "Family ride", "Speed runs", "Photo/video", "Long-distance", "Beginner-friendly"];

function NeutralChip({ children, height = 20 }: { children: string; height?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height,
        padding: height === 22 ? "0 9px" : "0 8px",
        borderRadius: 999,
        background: "#1B1B1B",
        border: "1px solid #2E2E2E",
        color: "#CFCFCF",
        fontSize: 9.5,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

const OnWater = () => {
  const [hideMe, setHideMe] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [visibleFor, setVisibleFor] = useState(1);
  const [ridingStyle, setRidingStyle] = useState(0);
  const [who, setWho] = useState(1);
  const [rideStyle, setRideStyle] = useState(0);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  return (
    <Screen tab="ride">
      <ScreenHeader
        title="On Water"
        backTo="/pwclab/ride"
        right={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#8A8A8A" strokeWidth="1.7" />
            <path
              d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4L5.6 5.6"
              stroke="#8A8A8A"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        }
      />
      <div className="pwl-scroll" style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 11, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 19, fontWeight: 800 }}>Lake Tapps</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3DDC84" }} />
              <div style={{ color: "#3DDC84", fontSize: 12, fontWeight: 600 }}>7 riders active now</div>
            </div>
          </div>
          <div
            onClick={() => setHideMe((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 32,
              padding: "0 12px",
              borderRadius: 999,
              background: "#111",
              border: "1px solid #272727",
              cursor: "pointer",
            }}
          >
            <div style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 600 }}>Hide me</div>
            <div style={{ width: 30, height: 17, borderRadius: 9, background: hideMe ? "#E10600" : "#252525", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: hideMe ? 15 : 2,
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: hideMe ? "#fff" : "#666",
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <div
            onClick={() => setCheckInOpen(true)}
            style={{
              flex: 1.2,
              height: 50,
              background: primaryGradient,
              border: "1px solid #FF3B2B",
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, letterSpacing: 1.2, textTransform: "uppercase" }}>I'm riding</div>
          </div>
          <div
            onClick={() => setCreateOpen(true)}
            style={{
              flex: 1,
              height: 50,
              border: "1px solid #272727",
              background: "#111",
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1, textTransform: "uppercase" }}>Create ride</div>
          </div>
        </div>
        {/* Riders */}
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
          Riding now
        </div>
        <Card radius={13} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#1B1B1B",
              border: "1px solid #2E2E2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B5B5B5",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            MM
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Mike M.</div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>2024 RXP-X 325 · Stage 2</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 20,
                  padding: "0 8px",
                  borderRadius: 999,
                  background: "rgba(225,6,0,0.1)",
                  border: "1px solid rgba(225,6,0,0.4)",
                  color: "#FF453A",
                  fontSize: 9.5,
                  fontWeight: 600,
                }}
              >
                Testing speed runs
              </div>
              <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5 }}>VISIBLE 2H</div>
            </div>
          </div>
          <div
            style={{
              height: 34,
              padding: "0 14px",
              border: "1px solid #272727",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Wave
          </div>
        </Card>
        <Card radius={13} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#1B1B1B",
              border: "1px solid #2E2E2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B5B5B5",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            JP
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Jason P.</div>
            <div style={{ color: "#8A8A8A", fontSize: 11 }}>Yamaha GP1800R SVHO</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <NeutralChip>Cruising</NeutralChip>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 20,
                  padding: "0 8px",
                  borderRadius: 999,
                  background: "rgba(61,220,132,0.1)",
                  border: "1px solid rgba(61,220,132,0.35)",
                  color: "#3DDC84",
                  fontSize: 9.5,
                  fontWeight: 600,
                }}
              >
                Open to meet up
              </div>
            </div>
          </div>
          <div
            style={{
              height: 34,
              padding: "0 14px",
              border: "1px solid #272727",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Wave
          </div>
        </Card>
        {/* Group rides */}
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
          Group rides today
        </div>
        <Card radius={13} style={{ padding: "13px 14px", display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>Sunset cruise — North end</div>
            <div style={{ fontFamily: MONO, color: "#FF453A", fontSize: 11.5, fontWeight: 700 }}>2:30 PM</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-6.5-5.5-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.5 12 21 12 21z"
                stroke="#8A8A8A"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ color: "#8A8A8A", fontSize: 11.5 }}>Meet at North Tapps Park ramp</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#1B1B1B",
                    border: "1.5px solid #0D0D0D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: 7,
                    fontWeight: 700,
                  }}
                >
                  MM
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#232323",
                    border: "1.5px solid #0D0D0D",
                    marginLeft: -7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: 7,
                    fontWeight: 700,
                  }}
                >
                  JP
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#2B2B2B",
                    border: "1.5px solid #0D0D0D",
                    marginLeft: -7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: 7,
                    fontWeight: 700,
                  }}
                >
                  +3
                </div>
              </div>
              <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5 }}>5 JOINED</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <NeutralChip height={22}>Cruise</NeutralChip>
            <NeutralChip height={22}>Beginner-friendly</NeutralChip>
            <div
              style={{
                marginLeft: "auto",
                height: 32,
                padding: "0 18px",
                background: primaryGradient,
                border: "1px solid #FF3B2B",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Join
            </div>
          </div>
        </Card>
        <div style={{ marginTop: "auto", paddingBottom: 12, fontFamily: MONO, color: "#555", fontSize: 10, lineHeight: 1.7, flexShrink: 0 }}>
          Lake-level presence only — exact location is never public. Friends + joined group rides can see live position, time-limited.
        </div>
      </div>

      {/* Check-in sheet */}
      <Sheet open={checkInOpen} onClose={() => setCheckInOpen(false)}>
        <div style={{ fontSize: 19, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Check in — I'm riding</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={fieldLabel}>Lake / area</div>
          <div
            style={{
              height: 48,
              background: "#111",
              border: "1px solid #272727",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Lake Tapps</div>
            <ChevronDown />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={fieldLabel}>Visible for</div>
          <div style={{ display: "flex", background: "#111", border: "1px solid #272727", borderRadius: 12, padding: 4, gap: 4 }}>
            {VISIBILITY.map((v, i) => {
              const active = i === visibleFor;
              return (
                <div
                  key={v}
                  onClick={() => setVisibleFor(i)}
                  style={{
                    flex: 1,
                    height: 34,
                    borderRadius: 9,
                    background: active ? primaryGradient : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active ? "#fff" : "#8A8A8A",
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={fieldLabel}>Riding style</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {STYLE_CHIPS.map((s, i) => {
              const active = i === ridingStyle;
              return (
                <div
                  key={s}
                  onClick={() => setRidingStyle(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 30,
                    padding: "0 12px",
                    borderRadius: 999,
                    background: active ? "rgba(225,6,0,0.1)" : "#111",
                    border: active ? "1px solid #E10600" : "1px solid #272727",
                    color: active ? "#fff" : "#8A8A8A",
                    fontSize: 11.5,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={fieldLabel}>Who can see me</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {WHO.map((w, i) => {
              const selected = i === who;
              return (
                <div
                  key={w.label}
                  onClick={() => setWho(i)}
                  style={{
                    border: selected ? "2px solid #E10600" : "1px solid #272727",
                    background: selected ? "#170808" : "#111",
                    borderRadius: 11,
                    padding: selected ? "9px 12px" : "10px 13px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  {selected ? (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#E10600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                    </div>
                  ) : (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid #555" }} />
                  )}
                  <div style={{ flex: 1, fontSize: 13, fontWeight: selected ? 700 : 600, color: selected ? "#fff" : "#CFCFCF" }}>
                    {w.label}
                    {w.suffix && <span style={{ color: "#8A8A8A", fontWeight: 500, fontSize: 11 }}>{w.suffix}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <PrimaryButton height={54} fontSize={16} onClick={() => setCheckInOpen(false)}>
          Check in
        </PrimaryButton>
        <div style={{ fontFamily: MONO, color: "#555", fontSize: 9.5, textAlign: "center" }}>
          Auto-expires · turn off anytime with HIDE ME · never use while operating.
        </div>
      </Sheet>

      {/* Create group ride sheet */}
      <Sheet open={createOpen} onClose={() => setCreateOpen(false)}>
        <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Create group ride</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div
            style={{
              height: 44,
              background: "#111",
              border: "1px solid #272727",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            Lake Tapps
          </div>
          <div
            style={{
              height: 44,
              background: "#111",
              border: "1px solid #272727",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            Sat · 2:30 PM
          </div>
          <div
            style={{
              height: 44,
              background: "#111",
              border: "1px solid #272727",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            North Tapps Park
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
              padding: "0 12px",
            }}
          >
            <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Max 8 riders</div>
            <ChevronDown size={11} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {RIDE_STYLE_CHIPS.map((s, i) => {
            const active = i === rideStyle;
            return (
              <div
                key={s}
                onClick={() => setRideStyle(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 28,
                  padding: "0 11px",
                  borderRadius: 999,
                  background: active ? "rgba(225,6,0,0.1)" : "#111",
                  border: active ? "1px solid #E10600" : "1px solid #272727",
                  color: active ? "#fff" : "#8A8A8A",
                  fontSize: 11,
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, display: "flex", background: "#111", border: "1px solid #272727", borderRadius: 10, padding: 3, gap: 3 }}>
            {(["public", "private"] as const).map((v) => {
              const active = visibility === v;
              return (
                <div
                  key={v}
                  onClick={() => setVisibility(v)}
                  style={{
                    flex: 1,
                    height: 30,
                    borderRadius: 8,
                    background: active ? "#252525" : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active ? "#fff" : "#8A8A8A",
                    fontSize: 11,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
          <div
            onClick={() => setCreateOpen(false)}
            style={{
              flex: 1.2,
              height: 44,
              background: primaryGradient,
              border: "1px solid #FF3B2B",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Post ride
          </div>
        </div>
      </Sheet>
    </Screen>
  );
};

export default OnWater;
