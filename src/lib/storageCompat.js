import { api, apiUrl } from "./api";
export const storage = { kind: "nineja-api-storage" };
export const ref = (_storage, path) => ({ path });
export async function uploadBytes(reference, file) {
  const body = new FormData();
  body.append("file", file);
  const result = await api("/api/users/me/upload", { method: "POST", body });
  return { ref: { ...reference, ...result }, metadata: { name: result.filename } };
}
export const getDownloadURL = async (reference) => apiUrl(reference.url);
