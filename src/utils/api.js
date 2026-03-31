export const getApiBase = () => {
  return process.env.NEXT_PUBLIC_BACKEND_API || "/api";
};

export const apiUrl = (path) => {
  const base = getApiBase().replace(/\/$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${base}${endpoint}`;
};

export const setLocalAuthCookies = (authToken, refreshToken) => {
  if (typeof document === "undefined") return;
  if (authToken) document.cookie = `authToken=${authToken}; path=/; SameSite=Lax`;
  if (refreshToken) document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Lax`;
};

export const clearLocalAuthCookies = () => {
  if (typeof document === "undefined") return;
  document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
};

export const getLocalCookie = (name) => {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
};

export const getAuthHeaders = (headers = {}) => {
  const authToken = getLocalCookie("authToken");
  const refreshToken = getLocalCookie("refreshToken");
  const mergedHeaders = { ...headers };

  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }

  if (refreshToken) {
    mergedHeaders["x-refresh-token"] = refreshToken;
  }

  return mergedHeaders;
};

export const authFetch = async (path, options = {}) => {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: getAuthHeaders(options.headers || {}),
  });

  const nextAuthToken = response.headers.get("x-auth-token");
  const nextRefreshToken = response.headers.get("x-refresh-token");

  if (nextAuthToken || nextRefreshToken) {
    setLocalAuthCookies(nextAuthToken || getLocalCookie("authToken"), nextRefreshToken || getLocalCookie("refreshToken"));
  }

  return response;
};
