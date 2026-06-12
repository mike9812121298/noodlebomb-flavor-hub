/* Standalone PWC Lab entry (pwclab.html). HashRouter so the static deploy
   (publish = ".") needs no SPA rewrites: /pwclab/#/pwclab/welcome. */
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import PwcLabApp from "./PwcLabApp";

createRoot(document.getElementById("pwclab-root")!).render(
  <HashRouter>
    <Routes>
      <Route path="/pwclab/*" element={<PwcLabApp />} />
      <Route path="*" element={<Navigate to="/pwclab/welcome" replace />} />
    </Routes>
  </HashRouter>
);
