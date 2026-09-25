import { api, apiUrl } from "./api";

// Temporary shape adapter so page components can keep their existing data model
// while all reads and writes go through the first-party FastAPI service.
export const db = { kind: "nineja-api" };

const stamp = () => new Date().toISOString();
const normalize = (value) => JSON.parse(JSON.stringify(value, (_, item) => item?.__transform === "timestamp" ? stamp() : item));
const refFor = (kind, path, id = null) => ({ kind, path, id });
export const collection = (_db, path, ...segments) => refFor("collection", [path, ...segments].join("/"));
export const doc = (_db, path, ...segments) => {
  if (typeof path !== "string") return refFor("doc", path.path, segments[0] || crypto.randomUUID());
  const parts = [path, ...segments];
  return refFor("doc", parts.slice(0, -1).join("/"), parts.at(-1));
};
export const query = (ref, ...constraints) => ({ ...ref, constraints });
export const where = (field, op, value) => ({ type: "where", field, op, value });
export const or = (...conditions) => ({ type: "or", conditions });
export const orderBy = (field, direction = "asc") => ({ type: "orderBy", field, direction });
export const limit = (count) => ({ type: "limit", count });
export const serverTimestamp = () => ({ __transform: "timestamp" });
export const increment = (amount) => ({ __transform: "increment", amount });
export const arrayUnion = (...values) => ({ __transform: "arrayUnion", values });
export const arrayRemove = (...values) => ({ __transform: "arrayRemove", values });

function snapshot(id, data) {
  return { id: String(id), exists: () => data !== null && data !== undefined, data: () => data };
}

async function list(ref) {
  const path = ref.path.split("/");
  let rows = [];
  const hasEmployerFilter = ref.constraints?.some((x) => x.field === "employerId" || x.field === "companyId");
  if (path[0] === "jobs") rows = hasEmployerFilter ? await api("/api/employer/jobs") : (await api("/api/jobs?limit=100")).items;
  else if (path[0] === "applications") {
    const byJob = ref.constraints?.find((x) => x.field === "jobId")?.value;
    const byUser = ref.constraints?.find((x) => x.field === "userId")?.value;
    if (Array.isArray(byJob)) {
      const ownJobs = await api("/api/employer/jobs");
      rows = (await Promise.all(ownJobs.filter((job) => byJob.map(String).includes(String(job.id))).map((job) => api(`/api/jobs/${job.id}/applications`)))).flat();
    } else if (byUser) rows = await api("/api/applications/me");
    else if (byJob) rows = await api(`/api/jobs/${byJob}/applications`);
    else if (hasEmployerFilter) {
      const ownJobs = await api("/api/employer/jobs");
      rows = (await Promise.all(ownJobs.map((job) => api(`/api/jobs/${job.id}/applications`)))).flat();
    } else rows = await api("/api/applications/me");
  } else if (path[0] === "notifications") rows = await api("/api/notifications");
  else if (path[0] === "reviews") {
    const name = ref.constraints?.find((x) => x.field === "companyName")?.value;
    rows = name ? await api(`/api/companies/${encodeURIComponent(name)}/reviews`) : [];
  } else if (path[0] === "companies") rows = await api("/api/companies");
  else if (path[0] === "conversations" && path.length === 1) rows = await api("/api/conversations");
  else if (path[0] === "conversations" && path[2] === "messages") rows = await api(`/api/conversations/${path[1]}/messages`);
  if (path[0] === "applications") rows = rows.map((row) => ({ ...row, resumeUrl: row.resumeUrl ? apiUrl(row.resumeUrl) : null }));
  const matches = (row, condition) => {
      const value = row[condition.field];
      if (condition.op === "==") return String(value) === String(condition.value);
      if (condition.op === "array-contains") return Array.isArray(value) && value.map(String).includes(String(condition.value));
      if (condition.op === "in") return condition.value.map(String).includes(String(value));
      return true;
  };
  for (const condition of ref.constraints?.filter((x) => x.type === "where") || []) {
    rows = rows.filter((row) => matches(row, condition));
  }
  const any = ref.constraints?.find((x) => x.type === "or");
  if (any) rows = rows.filter((row) => any.conditions.some((condition) => matches(row, condition)));
  if (path[0] === "conversations") {
    const participant = ref.constraints?.find((x) => x.field === "participants" && x.op === "array-contains")?.value;
    if (participant) rows = rows.filter((row) => row.participants?.map(String).includes(String(participant)));
  }
  const sorter = ref.constraints?.find((x) => x.type === "orderBy");
  if (sorter) rows.sort((a, b) => (String(a[sorter.field] || "").localeCompare(String(b[sorter.field] || ""))) * (sorter.direction === "desc" ? -1 : 1));
  const max = ref.constraints?.find((x) => x.type === "limit")?.count;
  if (max) rows = rows.slice(0, max);
  return rows;
}

export async function getDocs(ref) {
  const rows = await list(ref);
  return { docs: rows.map((row) => snapshot(row.id, row)), empty: rows.length === 0, size: rows.length, forEach: (fn) => rows.forEach((row) => fn(snapshot(row.id, row))) };
}

export async function getDoc(ref) {
  const [root, ...rest] = ref.path.split("/");
  let data = null;
  if (root === "jobs") data = await api(`/api/jobs/${ref.id}`).catch((error) => error.message.toLowerCase().includes("not found") ? null : Promise.reject(error));
  else if (root === "users" && rest[1] === "following") {
    const follow = await api(`/api/companies/${encodeURIComponent(ref.id)}/follow`).catch(() => null);
    data = follow?.following ? follow : null;
  }
  else if (root === "users") data = await api(`/api/users/${ref.id}`).catch((error) => error.message.toLowerCase().includes("not found") ? null : Promise.reject(error));
  else if (root === "conversations") data = await api(`/api/conversations/${ref.id}`).catch((error) => error.message.toLowerCase().includes("not found") ? null : Promise.reject(error));
  return snapshot(ref.id, data);
}

export async function addDoc(ref, data) {
  const [root, id, sub] = ref.path.split("/");
  const value = normalize(data);
  let result;
  if (root === "jobs") result = await api("/api/jobs", { method: "POST", body: JSON.stringify(value) });
  else if (root === "applications") result = await api(`/api/jobs/${value.jobId}/applications`, { method: "POST", body: JSON.stringify({ coverLetter: value.coverLetter || "", resumeFileId: value.resumeFileId || null }) });
  else if (root === "notifications") result = { id: "handled-by-domain-action" };
  else if (root === "reviews") result = await api(`/api/companies/${encodeURIComponent(value.companyName)}/reviews`, { method: "POST", body: JSON.stringify({ rating: value.rating, comment: [value.title, value.pros, value.cons].filter(Boolean).join("\n") }) });
  else if (root === "conversations" && sub === "messages") result = await api(`/api/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ body: value.text || value.body }) });
  else if (root === "conversations") result = await api("/api/conversations", { method: "POST", body: JSON.stringify({ otherUserId: Number(value.recipientId || value.otherUserId || value.participants?.at(-1)), jobId: Number(value.jobId) || null }) });
  else throw new Error(`Unsupported create operation: ${ref.path}`);
  return { id: String(result.id) };
}

export async function setDoc(ref, data) {
  const parts = ref.path.split("/");
  if (parts[0] === "users" && parts[2] === "following") {
    await api(`/api/companies/${encodeURIComponent(ref.id)}/follow`, { method: "PUT", body: "{}" });
    return;
  }
  return updateDoc(ref, data);
}

export async function updateDoc(ref, data) {
  const [root, id, sub] = ref.path.split("/");
  const value = normalize(data);
  if (root === "users" && data.savedJobs?.__transform) {
    const saved = await api("/api/saved-jobs");
    const ids = saved.map((job) => String(job.id));
    const transform = data.savedJobs;
    for (const item of transform.values || []) {
      if (transform.__transform === "arrayUnion" && !ids.includes(String(item))) await api(`/api/saved-jobs/${item}`, { method: "PUT" });
      if (transform.__transform === "arrayRemove" && ids.includes(String(item))) await api(`/api/saved-jobs/${item}`, { method: "DELETE" });
    }
  }
  else if (root === "users") {
    if (data.profileViews?.__transform === "increment") {
      await api(`/api/users/${id}/profile-view`, { method: "POST" });
      return;
    }
    const { name, ...profile } = value;
    await api("/api/users/me", { method: "PATCH", body: JSON.stringify({ ...(name !== undefined ? { name } : {}), profile }) });
  }
  else if (root === "jobs") {
    const current = await api(`/api/jobs/${id}`);
    await api(`/api/jobs/${id}`, { method: "PATCH", body: JSON.stringify({ ...current, ...value }) });
  } else if (root === "applications") await api(`/api/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status: value.status }) });
  else if (root === "notifications") await api(`/api/notifications/${id}/read`, { method: "PATCH", body: "{}" });
  else if (root === "conversations" && sub === "messages") await api(`/api/conversations/${id}/messages/${ref.id}/read`, { method: "PATCH", body: "{}" });
  else if (root === "conversations") await api(`/api/conversations/${id}`, { method: "PATCH", body: JSON.stringify(value) });
}

export async function deleteDoc(ref) {
  const [root, id, ...rest] = ref.path.split("/");
  if (root === "jobs") await api(`/api/jobs/${id}`, { method: "DELETE" });
  else if (root === "users" && rest[0] === "following") await api(`/api/companies/${encodeURIComponent(ref.id)}/follow`, { method: "DELETE" });
  else if (root === "conversations" && rest[1] === "messages") await api(`/api/conversations/${id}/messages/${ref.id}/read`, { method: "PATCH", body: "{}" });
}

export function onSnapshot(ref, onNext, onError) {
  let alive = true;
  const refresh = async () => {
    try {
      const snap = ref.kind === "doc" ? await getDoc(ref) : await getDocs(ref);
      if (alive) onNext(snap);
    } catch (error) { if (alive) onError?.(error); }
  };
  refresh();
  const timer = setInterval(refresh, 15000);
  return () => { alive = false; clearInterval(timer); };
}

export { api, apiUrl };
