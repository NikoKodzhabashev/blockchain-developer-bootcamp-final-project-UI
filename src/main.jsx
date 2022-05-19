import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MetaMaskProvider } from "metamask-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FundRaise from "./FundRaise";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetaMaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/fundraise/:id" element={<FundRaise />} />
        </Routes>
      </BrowserRouter>
    </MetaMaskProvider>
  </React.StrictMode>
);
