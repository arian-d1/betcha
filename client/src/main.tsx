import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import ContractFeed from "./components/ContractFeed.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/contracts" replace />} />
        <Route path="/contracts" element={<ContractFeed></ContractFeed>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
