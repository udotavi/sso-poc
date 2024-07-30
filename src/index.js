import App from "./App";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
