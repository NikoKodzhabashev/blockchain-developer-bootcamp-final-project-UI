import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MetaMaskProvider } from "metamask-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyCampaigns from "./MyCampaigns";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetaMaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/my-campaigns" element={<MyCampaigns />} />
        </Routes>
      </BrowserRouter>
    </MetaMaskProvider>
  </React.StrictMode>
);
