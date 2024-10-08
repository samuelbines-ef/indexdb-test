import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AssetProvider } from "./AssetContext.tsx";
import "./index.css";

const RootWrapper = () => {
  return (
    <StrictMode>
      <AssetProvider>
        <App />
      </AssetProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<RootWrapper />);
