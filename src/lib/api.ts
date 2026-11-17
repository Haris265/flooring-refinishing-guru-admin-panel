import {
  clearSession,
  getAccessToken,
  getApiBase,
  refreshAccessToken,
} from "./auth";

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  json?: unknown;
  formData?: FormData;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function adminFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", json, formData, auth = true } = options;
  const headers: Record<string, string> = { Accept: "application/json" };

  let body: BodyInit | undefined | null = options.body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData;
  }

  const doRequest = async (token: string | null) => {
    if (auth && token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${getApiBase()}${path}`, { method, headers, body });
  };

  let token = auth ? getAccessToken() : null;
  let res = await doRequest(token);

  if (auth && res.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      clearSession();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new ApiError("Session expired", 401);
    }
    res = await doRequest(token);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message =
        data.detail ||
        (typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : message);
    } catch {
      /* ignore */
    }
    if (res.status === 401) {
      clearSession();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => adminFetch<T>(path),
  post: <T>(path: string, json?: unknown) =>
    adminFetch<T>(path, { method: "POST", json }),
  patch: <T>(path: string, json?: unknown) =>
    adminFetch<T>(path, { method: "PATCH", json }),
  delete: <T>(path: string) => adminFetch<T>(path, { method: "DELETE" }),
  postForm: <T>(path: string, formData: FormData) =>
    adminFetch<T>(path, { method: "POST", formData }),
  patchForm: <T>(path: string, formData: FormData) =>
    adminFetch<T>(path, { method: "PATCH", formData }),
};
