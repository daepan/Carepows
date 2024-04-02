import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ImageProvider } from "./components/context/ImageContext";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ImageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ImageProvider>
  </React.StrictMode>
);
