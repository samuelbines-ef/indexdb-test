import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { useAssets } from "./AssetContext";
import ReactLoading from "react-loading";

interface ImageHandlerProps {
  src: string;
  alt: string;
  className: string;
  id: string;
  mimeType?: "video" | "audio" | "image";
}

function AssetHandler({
  src,
  alt,
  className,
  id,
  mimeType = "image",
}: ImageHandlerProps) {
  const { assets, getAsset, fetchAndStoreAsset } = useAssets();
  const [image, setAsset] = useState(null);

  const handleAssetRetrieval = useCallback(async () => {
    getAsset(id).then((asset) => {
      if (asset) {
        setAsset(URL.createObjectURL(asset));
      } else {
        // If not in IndexedDB, fetch and store it
        fetchAndStoreAsset(id, src);
      }
    });
  }, [setAsset, getAsset, fetchAndStoreAsset, id, src]);

  useEffect(() => {
    handleAssetRetrieval();
  }, [getAsset, fetchAndStoreAsset, assets, handleAssetRetrieval]);

  if (image && mimeType === "image")
    return <img src={image} className={className} alt={alt} />;
  if (image && mimeType === "video")
    return <video src={image} className={className} controls />;
  if (image && mimeType === "audio")
    return <audio src={image} className={className} />;
  if (image) return <></>;
  return <ReactLoading type="spin" color="#000" />;
}

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <AssetHandler
            src={"src/assets/vite.svg"}
            id="vite"
            className="logo vite"
            alt="React logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <AssetHandler
            src={"src/assets/react.svg"}
            id="react"
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <AssetHandler
          src={"src/assets/screen-record.mov"}
          id="video"
          className="logo"
          alt="logo"
          mimeType="video"
        />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
