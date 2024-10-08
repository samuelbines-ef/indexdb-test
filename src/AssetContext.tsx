// AssetContext.js
import React, { createContext, useContext, useState } from "react";
import { getAsset as getA, storeAsset } from "./indexdb";

// Create a context for the assets
const AssetContext = createContext({
  assets: {},
  getAsset: () => null,
  fetchAndStoreAsset: () => null,
});

// Custom hook to access the AssetContext
export const useAssets = () => useContext(AssetContext);

interface IAsset {
  [key: string]: string;
}
// AssetProvider component to provide assets and manage fetching/storing
export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState<IAsset>({});

  // Retrieve asset from IndexedDB or use the fallback
  const getAsset = async (id: string) => {
    try {
      const storedAsset = await getA(id);
      if (storedAsset) {
        console.log("fetched asset from indexeddb");
        // If the asset is found in IndexedDB, return it
        return storedAsset.data;
      }
      // Otherwise, return the fallback asset from state
      return assets[id];
    } catch (error) {
      console.error(`Failed to retrieve asset with id ${id}:`, error);
      return assets[id]; // Return fallback asset on error
    }
  };

  // Fetch and store asset in IndexedDB
  const fetchAndStoreAsset = async (id: string, url: string) => {
    try {
      const response = await fetch(window.location.href + url);
      const blob = await response.blob();
      // Store the fetched asset in IndexedDB
      await storeAsset(id, blob);

      console.log("fetched asset from api call");
      // Update the assets in the state
      setAssets((prevAssets) => ({
        ...prevAssets,
        [id]: URL.createObjectURL(blob),
      }));
    } catch (error) {
      console.error(`Failed to fetch and store asset with id ${id}:`, error);
    }
  };

  return (
    <AssetContext.Provider value={{ assets, getAsset, fetchAndStoreAsset }}>
      {children}
    </AssetContext.Provider>
  );
};
