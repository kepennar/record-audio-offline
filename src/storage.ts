import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "KeKe POC",
  version: 1.0,
  storeName: "keke-store",
  description: "storing some audio"
});

export async function listKeys() {
  return localforage.keys();
}

export async function setBlob(name: string, blob: Blob) {
  return localforage.setItem(name, blob);
}

export async function getBlob(itemKey: string) {
  return localforage.getItem<Blob>(itemKey);
}

export async function getBlobAsObjectUrl(
  itemKey: string
): Promise<string | null> {
  const blob = await localforage.getItem<Blob>(itemKey);
  if (!blob) {
    return null;
  }
  return URL.createObjectURL(blob);
}
