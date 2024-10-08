import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { useAssets } from "./AssetContext";
import ReactLoading from "react-loading";

interface ImageHandlerProps {
  src: string;
  alt: string;
  className: string;
  id: string;
}

function ImageHandler({ src, alt, className, id }: ImageHandlerProps) {
  const [count, setCount] = useState(0);
  const { assets, getAsset, fetchAndStoreAsset } = useAssets();
  const [image, setImage] = useState(null);

  const handleAssetRetrieval = useCallback(async () => {
    getAsset(id).then((asset) => {
      if (asset) {
        setImage(URL.createObjectURL(asset));
      } else {
        // If not in IndexedDB, fetch and store it
        fetchAndStoreAsset(id, src);
      }
    });
  }, []);
  useEffect(() => {
    handleAssetRetrieval();
  }, [getAsset, fetchAndStoreAsset, assets]);

  if (image) return <img src={image} className={className} alt={alt} />;
  return <ReactLoading type="spin" color="#000" />;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <ImageHandler
            src={"src/assets/vite.svg"}
            id="vite"
            className="logo vite"
            alt="React logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <ImageHandler
            src={"src/assets/react.svg"}
            id="react"
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
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
