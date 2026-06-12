/* PWC Lab shared UI kit — exact tokens from the design-pass style guide. */
import { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const MONO = "'JetBrains Mono', monospace";
export const EASE = "cubic-bezier(.2,.7,.2,1)";

export const COLORS = {
  canvas: "#000000",
  surface1: "#111111",
  surface2: "#1B1B1B",
  hairline: "#252525",
  rowDivider: "#1E1E1E",
  accent: "#E10600",
  accentBright: "#FF453A",
  accentDim: "#7A0300",
  verified: "#3DDC84",
  caution: "#FFC53D",
  info: "#3EA8EF",
  text: "#FFFFFF",
  muted: "#8A8A8A",
  faint: "#555555",
  disabledValue: "#3A3A3A",
} as const;

/* Cards: vertical grad #161616→#0D0D0D, 1px #272727, lit top edge #343434. */
export const cardStyle: CSSProperties = {
  background: "linear-gradient(180deg, #161616 0%, #0D0D0D 100%)",
  border: "1px solid #272727",
  borderTopColor: "#343434",
  borderRadius: 14,
};

/* Red-tint card — "your rank" treatment. */
export const redTintCardStyle: CSSProperties = {
  background: "#170808",
  border: "1px solid #7A0300",
  borderRadius: 14,
};

/* Primary buttons: polished red gradient + hot edge highlight. */
export const primaryGradient = "linear-gradient(180deg, #FF1B0B 0%, #C20500 100%)";

export function Card({
  style,
  children,
  onClick,
  radius = 14,
}: {
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  radius?: number;
}) {
  return (
    <div onClick={onClick} style={{ ...cardStyle, borderRadius: radius, cursor: onClick ? "pointer" : undefined, ...style }}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  height = 56,
  glow = false,
  breathe = false,
  onClick,
  style,
  fontSize = 17,
}: {
  children: ReactNode;
  height?: number;
  glow?: boolean;
  breathe?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  fontSize?: number;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height,
        background: primaryGradient,
        borderRadius: 14,
        border: "1px solid #FF3B2B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
        boxShadow: glow ? "0 0 26px rgba(225,6,0,0.35)" : undefined,
        animation: breathe ? `pwlCtaGlow 3.5s ease-in-out 1.8s infinite` : undefined,
        ...style,
      }}
    >
      <div style={{ color: "#fff", fontWeight: 700, fontSize, letterSpacing: 1.5, textTransform: "uppercase" }}>{children}</div>
    </div>
  );
}

export function SecondaryButton({
  children,
  height = 48,
  onClick,
  style,
  fontSize = 14,
}: {
  children: ReactNode;
  height?: number;
  onClick?: () => void;
  style?: CSSProperties;
  fontSize?: number;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height,
        background: "transparent",
        border: "1px solid #252525",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        ...style,
      }}
    >
      <div style={{ color: "#fff", fontWeight: 600, fontSize, letterSpacing: 1, textTransform: "uppercase" }}>{children}</div>
    </div>
  );
}

const CHIP_TINTS = {
  green: { bg: "rgba(61,220,132,0.12)", border: "rgba(61,220,132,0.4)", color: "#3DDC84" },
  yellow: { bg: "rgba(255,197,61,0.1)", border: "rgba(255,197,61,0.35)", color: "#FFC53D" },
  red: { bg: "rgba(225,6,0,0.1)", border: "rgba(225,6,0,0.4)", color: "#FF453A" },
  blue: { bg: "rgba(62,168,239,0.1)", border: "rgba(62,168,239,0.4)", color: "#3EA8EF" },
  neutral: { bg: "#1B1B1B", border: "#252525", color: "#fff" },
} as const;

export function Chip({
  tint = "neutral",
  dot = false,
  children,
  height = 26,
  style,
}: {
  tint?: keyof typeof CHIP_TINTS;
  dot?: boolean;
  children: ReactNode;
  height?: number;
  style?: CSSProperties;
}) {
  const t = CHIP_TINTS[tint];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        height,
        padding: "0 10px",
        borderRadius: 999,
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        ...style,
      }}
    >
      {dot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }} />}
      {children}
    </div>
  );
}

/* Section header: 700/13 caps +1.2 with 3px red left tick. */
export function SectionHeader({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
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
        {children}
      </div>
      {action && (
        <div onClick={onAction} style={{ color: "#E10600", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          {action}
        </div>
      )}
    </div>
  );
}

export function MetricTile({
  label,
  value,
  unit,
  unitColor = "#8A8A8A",
  valueColor = "#fff",
  valueSize = 25,
  style,
}: {
  label: string;
  value: string;
  unit?: string;
  unitColor?: string;
  valueColor?: string;
  valueSize?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ ...cardStyle, borderRadius: 12, padding: "11px 14px", display: "flex", flexDirection: "column", gap: 2, ...style }}>
      <div style={{ color: "#8A8A8A", fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: valueSize, lineHeight: 1.1, color: valueColor }}>{value}</div>
        {unit && <div style={{ color: unitColor, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8 }}>{unit}</div>}
      </div>
    </div>
  );
}

export function Wordmark({ size = 21 }: { size?: number }) {
  return (
    <div style={{ fontStyle: "italic", fontWeight: 900, fontSize: size, lineHeight: 1 }}>
      <span style={{ color: "#fff" }}>PWC</span>
      <span style={{ color: "#E10600" }}>&nbsp;LAB</span>
    </div>
  );
}

/* ---------- icons ---------- */

export const ChevronRight = ({ size = 15, color = "#555" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M6 3l5 5-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDown = ({ size = 12, color = "#8A8A8A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 6l5 5 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BackArrow = ({ color = "#fff" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14.5 5l-7 7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckMark = ({ size = 15, color = "#3DDC84", strokeWidth = 2.2 }: { size?: number; color?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5 13l4 4 10-11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PinIcon = ({ size = 16, color = "#8A8A8A", strokeWidth = 1.7 }: { size?: number; color?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s-6.5-5.5-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.5 12 21 12 21z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10.8" r="2.4" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

/* ---------- screen chrome ---------- */

export type TabKey = "home" | "garage" | "ride" | "leaders" | "profile";

const TAB_ROUTES: Record<TabKey, string> = {
  home: "/pwclab/home",
  garage: "/pwclab/garage",
  ride: "/pwclab/ride",
  leaders: "/pwclab/leaders",
  profile: "/pwclab/profile",
};

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const c = active ? "#E10600" : "#6E6E6E";
  const w = active ? 1.8 : 1.7;
  switch (tab) {
    case "home":
      return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path d="M4 11L12 4.5L20 11V19.5H14.5V14H9.5V19.5H4V11Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
        </svg>
      );
    case "garage":
      return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path
            d="M14.6 6.4a4.2 4.2 0 0 0-5.5 5.4L4 16.9 7.1 20l5.1-5.1a4.2 4.2 0 0 0 5.4-5.5l-2.6 2.6-2.9-2.9 2.5-2.7z"
            stroke={c}
            strokeWidth={w}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ride":
      return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke={c} strokeWidth={w} />
          <circle cx="12" cy="12" r="3.2" fill={c} />
        </svg>
      );
    case "leaders":
      return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
          <path
            d="M7 5.5H4.5V7a3 3 0 0 0 3 3M17 5.5h2.5V7a3 3 0 0 1-3 3M12 13.5V17M8.5 20h7"
            stroke={c}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "profile":
      return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8.5" r="3.4" stroke={c} strokeWidth={w} />
          <path d="M5.5 19.5c1.3-3.2 3.7-4.8 6.5-4.8s5.2 1.6 6.5 4.8" stroke={c} strokeWidth={w} strokeLinecap="round" />
        </svg>
      );
  }
}

const TAB_LABELS: Record<TabKey, string> = {
  home: "Home",
  garage: "Garage",
  ride: "Ride",
  leaders: "Leaders",
  profile: "Profile",
};

export function TabBar({ active }: { active: TabKey }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        marginTop: "auto",
        background: "linear-gradient(180deg, #101010 0%, #050505 100%)",
        borderTop: "1px solid #232323",
        display: "flex",
        height: 74,
        flexShrink: 0,
      }}
    >
      {(Object.keys(TAB_ROUTES) as TabKey[]).map((tab) => {
        const isActive = tab === active;
        return (
          <div
            key={tab}
            onClick={() => navigate(TAB_ROUTES[tab])}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              paddingTop: 11,
              cursor: "pointer",
            }}
          >
            <TabIcon tab={tab} active={isActive} />
            <div
              style={{
                fontSize: 9.5,
                fontWeight: isActive ? 700 : 600,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: isActive ? "#E10600" : "#6E6E6E",
              }}
            >
              {TAB_LABELS[tab]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Sub-screen header: 58h, back / centered title / right slot. */
export function ScreenHeader({ title, backTo, right }: { title: string; backTo?: string; right?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: 58,
        padding: "0 16px",
        display: "grid",
        gridTemplateColumns: "36px 1fr 36px",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div onClick={() => (backTo ? navigate(backTo) : navigate(-1))} style={{ cursor: "pointer", display: "flex" }}>
        <BackArrow />
      </div>
      <div style={{ textAlign: "center", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{title}</div>
      <div style={{ justifySelf: "end", display: "flex" }}>{right}</div>
    </div>
  );
}

/* Full screen scaffold: dark canvas, optional tab bar pinned to bottom. */
export function Screen({ tab, children }: { tab?: TabKey; children: ReactNode }) {
  return (
    <div
      className="pwl-root"
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
    >
      {children}
      {tab && <TabBar active={tab} />}
    </div>
  );
}

/* Bottom sheet over a 62% scrim, with 38×4 grabber. */
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)" }} />
      <div
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #161616 0%, #0A0A0A 100%)",
          borderTop: "1px solid #343434",
          borderRadius: "24px 24px 0 0",
          padding: "12px 20px 30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          animation: `pwlSheetUp 0.35s ${EASE} both`,
          maxHeight: "92%",
          overflowY: "auto",
        }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 2, background: "#333", alignSelf: "center", flexShrink: 0 }} />
        {children}
      </div>
    </div>
  );
}
