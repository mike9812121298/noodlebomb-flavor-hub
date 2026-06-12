import { useNavigate } from "react-router-dom";
import { Screen, ScreenHeader, MONO, cardStyle, redTintCardStyle, ChevronRight, ChevronDown } from "../ui";
import { mods } from "../data";

const MyMods = () => {
  const navigate = useNavigate();

  return (
    <Screen tab="garage">
      <ScreenHeader
        title="My mods"
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
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Installed</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19 }}>8</div>
          </div>
          <div style={{ width: 1, height: 30, background: "#252525" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Verified gain</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#3DDC84" }}>
              +4.8 <span style={{ fontSize: 11 }}>MPH</span>
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: "#252525" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>Top speed</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19 }}>81.4</div>
          </div>
        </div>
        {mods.map((mod) => (
          <div key={mod.name} style={{ ...cardStyle, borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 58, height: 58, borderRadius: 9, background: "#fff", overflow: "hidden", flexShrink: 0 }}>
              <img src={mod.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={mod.name} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{mod.name}</div>
              <div style={{ color: "#8A8A8A", fontSize: 11.5 }}>{mod.installed}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <div style={{ fontFamily: MONO, color: mod.gainColor, fontSize: 13, fontWeight: 700 }}>{mod.gain}</div>
                {mod.note && <div style={{ color: "#555", fontSize: 10.5 }}>{mod.note}</div>}
              </div>
            </div>
            <ChevronRight />
          </div>
        ))}
        <div
          style={{
            border: "1px dashed #2A2A2A",
            borderRadius: 12,
            padding: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div style={{ color: "#8A8A8A", fontSize: 12.5, fontWeight: 600 }}>4 more mods</div>
          <ChevronDown size={13} color="#555" />
        </div>
        <div
          onClick={() => navigate("/pwclab/garage/upgrade-path")}
          style={{ ...redTintCardStyle, borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V6M6 12l6-6 6 6" stroke="#E10600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Recommended upgrades</div>
            <div style={{ color: "#8A8A8A", fontSize: 11.5 }}>2 parts fit your build · est. +2.4 mph</div>
          </div>
          <ChevronRight color="#E10600" />
        </div>
      </div>
    </Screen>
  );
};

export default MyMods;
