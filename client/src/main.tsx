import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="md:px-0 px-4 lg:px-0">
        <App />
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>
);
