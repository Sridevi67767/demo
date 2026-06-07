// ============================================================
// FILE: src/index.js
// PURPOSE: The entry point — mounts your React app into the HTML.
//          You almost never need to touch this file.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
