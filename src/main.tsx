import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { addCollection } from "@iconify/react";
import { icons as mageIcons } from "@iconify-json/mage";
import "./index.css";
import App from "./App.tsx";

addCollection(mageIcons);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
