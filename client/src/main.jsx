import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "tailwindcss";
import App from "./App.jsx";
import axios from "axios";
// axios.defaults.withCre

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
