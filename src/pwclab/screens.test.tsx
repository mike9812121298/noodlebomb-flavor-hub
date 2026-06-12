import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ComponentType } from "react";

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

const screens: Array<[string, ComponentType]> = [
  ["Welcome", Welcome],
  ["Home", Home],
  ["SpeedRun", SpeedRun],
  ["Leaderboards", Leaderboards],
  ["Badges", Badges],
  ["Profile", Profile],
  ["ShareCard", ShareCard],
  ["Garage", Garage],
  ["MyMods", MyMods],
  ["UpgradePath", UpgradePath],
  ["TestData", TestData],
  ["BuildPlan", BuildPlan],
  ["BuildCompare", BuildCompare],
  ["Maintenance", Maintenance],
  ["AiMechanic", AiMechanic],
  ["RideHub", RideHub],
  ["RideReport", RideReport],
  ["NavigateMap", NavigateMap],
  ["OnWater", OnWater],
];

describe("PWC Lab screens render without crashing", () => {
  it.each(screens)("%s", (_name, Component) => {
    const { container } = render(
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    );
    expect(container.firstChild).not.toBeNull();
    cleanup();
  });

  it.each(["1", "2", "3", "4", "5", "6"])("Onboarding step %s", (step) => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/pwclab/onboarding/${step}`]}>
        <Routes>
          <Route path="/pwclab/onboarding/:step" element={<Onboarding />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.firstChild).not.toBeNull();
    cleanup();
  });
});
