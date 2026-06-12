/* PWC Lab — app shell. Mobile-first: full viewport on phones, centered
   390×844 device frame on desktop (the design sheet's frame size). */
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pwclab.css";

import Welcome from "./screens/Welcome";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import SpeedRun from "./screens/SpeedRun";
import Leaderboards from "./screens/Leaderboards";
import Badges from "./screens/Badges";
import Profile from "./screens/Profile";
import ShareCard from "./screens/ShareCard";
import Garage from "./screens/Garage";
import MyMods from "./screens/MyMods";
import UpgradePath from "./screens/UpgradePath";
import TestData from "./screens/TestData";
import BuildPlan from "./screens/BuildPlan";
import BuildCompare from "./screens/BuildCompare";
import Maintenance from "./screens/Maintenance";
import AiMechanic from "./screens/AiMechanic";
import RideHub from "./screens/RideHub";
import RideReport from "./screens/RideReport";
import NavigateMap from "./screens/NavigateMap";
import OnWater from "./screens/OnWater";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 480);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 480);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isDesktop;
}

const PwcLabApp = () => {
  const isDesktop = useIsDesktop();

  const routes = (
    <Routes>
      <Route path="/" element={<Navigate to="welcome" replace />} />
      <Route path="welcome" element={<Welcome />} />
      <Route path="onboarding/:step" element={<Onboarding />} />
      <Route path="home" element={<Home />} />
      <Route path="speed-run" element={<SpeedRun />} />
      <Route path="leaders" element={<Leaderboards />} />
      <Route path="badges" element={<Badges />} />
      <Route path="profile" element={<Profile />} />
      <Route path="share-card" element={<ShareCard />} />
      <Route path="garage" element={<Garage />} />
      <Route path="garage/mods" element={<MyMods />} />
      <Route path="garage/upgrade-path" element={<UpgradePath />} />
      <Route path="garage/build-plan" element={<BuildPlan />} />
      <Route path="garage/maintenance" element={<Maintenance />} />
      <Route path="garage/mechanic" element={<AiMechanic />} />
      <Route path="test-data" element={<TestData />} />
      <Route path="build-compare" element={<BuildCompare />} />
      <Route path="ride" element={<RideHub />} />
      <Route path="ride/report" element={<RideReport />} />
      <Route path="ride/navigate" element={<NavigateMap />} />
      <Route path="on-water" element={<OnWater />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );

  if (!isDesktop) {
    return <div style={{ height: "100dvh", background: "#000" }}>{routes}</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9EAEC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
        fontFamily: "'Chakra Petch', sans-serif",
      }}
    >
      <div
        style={{
          width: 390,
          height: 844,
          background: "#000",
          borderRadius: 32,
          boxShadow: "0 28px 64px rgba(0,0,0,0.26), 0 3px 10px rgba(0,0,0,0.14)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {routes}
      </div>
    </div>
  );
};

export default PwcLabApp;
