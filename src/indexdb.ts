import { openDB } from "idb";

// Create or open a database with a specified store
const initDB = async () => {
  const db = await openDB("assets-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("assets")) {
        db.createObjectStore("assets", { keyPath: "id" }); // Use 'id' as the key
      }
    },
  });
  return db;
};

interface Asset {
  id: string;
  data: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    content: string;
  };
}

// Add or update an asset in the 'assets' store
export const storeAsset = async (id: string, data) => {
  const db = await initDB();
  await db.put("assets", { id, data });
};

// Retrieve an asset by id
export const getAsset = async (id: string) => {
  const db = await initDB();
  return await db.get("assets", id);
};

// Delete an asset by id
export const deleteAsset = async (id: string) => {
  const db = await initDB();
  await db.delete("assets", id);
};

// Retrieve all stored assets
export const getAllAssets = async () => {
  const db = await initDB();
  return await db.getAll("assets");
};
