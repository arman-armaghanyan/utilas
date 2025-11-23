export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type MiniTool = {
  _id?: string;
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnail: string;
  iframeSlug: string;
  iframeHtml?: string;
  reactAppUrl?: string;
  appType?: "html" | "react";
  iframeUrl?: string;
  iframeFullUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MiniToolPayload = Omit<
  MiniTool,
  "_id" | "createdAt" | "updatedAt" | "iframeUrl" | "reactAppUrl"
>;

const isServer = typeof window === "undefined";
const resolvedBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (isServer
    ? process.env.API_BASE_URL ||
      `http://127.0.0.1:${process.env.PORT || process.env.NEXT_PUBLIC_PORT || 4003}`
    : "");

const API_BASE_URL = resolvedBase.replace(/\/$/, "");

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  console.log(response);
  if (!response.ok) {
    const message = await extractError(response);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function extractError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data?.message) {
      return data.message;
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || "Request failed";
}

export function getTools(): Promise<MiniTool[]> {
  return request<MiniTool[]>("/api/tools");
}

export function getTool(id: string): Promise<MiniTool> {
  return request<MiniTool>(`/api/tools/${id}`);
}

export function createTool(payload: MiniToolPayload): Promise<MiniTool> {
  return request<MiniTool>("/api/tools", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTool(
  id: string,
  payload: Partial<MiniToolPayload>
): Promise<MiniTool> {
  return request<MiniTool>(`/api/tools/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTool(id: string): Promise<void> {
  return request<void>(`/api/tools/${id}`, { method: "DELETE" });
}

 export async function uploadReactApp(
  id: string,
  file: File
): Promise<MiniTool> {
  const formData = new FormData();
  formData.append("reactApp", file);

  const isServer = typeof window === "undefined";
  const resolvedBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (isServer
      ? process.env.API_BASE_URL ||
        `http://127.0.0.1:${process.env.PORT || process.env.NEXT_PUBLIC_PORT || 4003}`
      : "");

  const API_BASE_URL = resolvedBase.replace(/\/$/, "");
  const url = API_BASE_URL ? `${API_BASE_URL}/api/tools/${id}/upload-react-app` : `/api/tools/${id}/upload-react-app`;

  return fetch(url, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => {
    if (!response.ok) {
      const message = await extractError(response);
      throw new ApiError(message, response.status);
    }
    return response.json();
  });
}

