import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installGoogleAdsTag } from "./lib/google-ads";

installGoogleAdsTag();
createRoot(document.getElementById("root")!).render(<App />);
