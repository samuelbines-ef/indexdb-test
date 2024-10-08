import { openDB } from "idb";

// Create or open a database with a specified store
const initDB = async (name: string = "assets-db") => {
  const db = await openDB(name, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("assets")) {
        db.createObjectStore("assets", { keyPath: "id" }); // Use 'id' as the key
      }
    },
  });
  return db;
};

// Add or update an asset in the 'assets' store
export const storeAsset = async (id: string, data) => {
  const db = await initDB();
  await db.put("assets", { id, data, createdAt: new Date() });
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

export const trimAssets = async (maxSizeInBytes = 5 * 1024 * 1024) => {
  const assets = (await getAllAssets()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  ); // Get all assets
  let totalSize = await getAssetsSize(assets);

  while (totalSize > maxSizeInBytes && assets.length > 0) {
    const oldestAsset = assets.shift(); // Get the oldest asset
    await deleteAsset(oldestAsset.id); // Delete the oldest asset
    // Recalculate total size after deleting the asset
    totalSize = await getAssetsSize(assets);
    console.log(
      `Deleted asset: ${oldestAsset.id}, New total size: ${totalSize} bytes`
    );
  }
  return totalSize;
};

const getAssetsSize = (assets: any[]) => {
  let totalSize = 0;
  assets.forEach((record) => {
    const recordSize = new TextEncoder().encode(JSON.stringify(record)).length;
    totalSize += recordSize;
  });
  return totalSize; // Re
};

const getIndexedDBSize = async () => {
  // Open the database
  const db = await initDB();
  const assets = await getAllAssets();
  // Iterate over each object store in the database
  const totalSize = getAssetsSize(assets);
  db.close();
  return totalSize;
};

getIndexedDBSize().then((size) => {
  console.log(`Total size of IndexedDB: ${size} bytes`);
});

window.addEventListener("load", async () => {
  const sizeBefore = await getIndexedDBSize();
  console.log(`Total size of IndexedDB before trimming: ${sizeBefore} bytes`);

  // Trim assets to a maximum of 100 bytes for example
  await trimAssets(100);

  const sizeAfter = await getIndexedDBSize();
  console.log(`Total size of IndexedDB after trimming: ${sizeAfter} bytes`);
});
