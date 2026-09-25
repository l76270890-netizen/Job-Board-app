const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredApiUrl || (import.meta.env.DEV ? "http://localhost:8000" : "")).replace(/\/$/, "");

function requireApiUrl() {
  if (!API_URL) {
    throw new Error("The API URL is not configured. Set VITE_API_URL to your deployed backend URL in Vercel, then redeploy the frontend.");
  }
}

export async function api(path, options = {}) {
  requireApiUrl();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Could not reach the API at ${API_URL}. Check that the backend is deployed and allows this frontend's origin.`);
    }
    throw error;
  }
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body.detail;
    throw new Error(typeof detail === "string" ? detail : detail?.[0]?.msg || `Request failed (${response.status})`);
  }
  return body;
}

export const apiUrl = (path) => {
  requireApiUrl();
  return `${API_URL}${path}`;
};
