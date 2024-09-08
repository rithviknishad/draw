import Sentry from "@/sentry.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry />
    <App />
    <Toaster theme="light" richColors toastOptions={{}} />
  </StrictMode>
);
