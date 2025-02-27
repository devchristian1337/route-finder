// Import theme script first to avoid flash of wrong theme
import "./lib/theme-script.js";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
