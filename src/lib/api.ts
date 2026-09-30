import axios from "axios";
import type { AxiosInstance } from "axios";

const isServer = typeof window === "undefined";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.PUBLIC_API_URL 
) as string;

// Client Key support untuk server-side dan client-side
export const CLIENT_KEY = (
  process.env.NEXT_PUBLIC_CLIENT_KEY ??
  process.env.PUBLIC_CLIENT_KEY ??
  process.env.CLIENT_KEY
) as string;

function addErrorInterceptor(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const message =
        err.response?.data?.message ?? err.message ?? "Terjadi kesalahan";
      const error = new Error(message) as Error & {
        status?: number;
        response?: any;
      };
      if (err.response?.status) error.status = err.response.status;
      error.response = err.response;
      return Promise.reject(error);
    },
  );
  return instance;
}

// ── Public API — no auth, server + client ────────────────────────────────────
export const publicApi = addErrorInterceptor(
  axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: {
      Accept: "application/json",
      ...(CLIENT_KEY ? { "X-Client-Key": CLIENT_KEY } : {}),
    },
  }),
);

// ── Server-side authenticated API (per-request instance) ─────────────────────
export function serverApi(token: string): AxiosInstance {
  return addErrorInterceptor(
    axios.create({
      baseURL: BASE_URL,
      timeout: 10_000,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(CLIENT_KEY ? { "X-Client-Key": CLIENT_KEY } : {}),
      },
    }),
  );
}

// ── Client-side API — singleton, auto-inject token, handle 401 ───────────────
let _instance: AxiosInstance | null = null;

export function useApi(): AxiosInstance {
  if (_instance) return _instance;

  _instance = axios.create({
    baseURL: "/api",
    timeout: 10_000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Inject token dari cookie di setiap request
  _instance.interceptors.request.use((config) => {
    const match = document.cookie.match(/(?:^|;\s*)authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (token) config.headers.set("Authorization", `Bearer ${token}`);

    return config;
  });

  _instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const isLoginRequest =
        err.config?.url?.includes("/auth/login") ||
        window.location.pathname.startsWith("/auth/login");

      if (err.response?.status === 401 && !isLoginRequest) {
        const from = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.href = `/auth/login?from=${from}`;
        return Promise.reject(err);
      }

      if (err.response?.status === 429) {
        const error = new Error(
          "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.",
        ) as Error & { status?: number; response?: any };
        error.status = 429;
        error.response = err.response;
        return Promise.reject(error);
      }

      const message =
        err.response?.data?.message ?? err.message ?? "Terjadi kesalahan";
      const error = new Error(message) as Error & {
        status?: number;
        response?: any;
      };
      if (err.response?.status) error.status = err.response.status;
      error.response = err.response;
      return Promise.reject(error);
    },
  );

  return _instance;
}