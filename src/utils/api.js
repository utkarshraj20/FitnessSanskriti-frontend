export const getApiBase = () => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "/api";
  }
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
