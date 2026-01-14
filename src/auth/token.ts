let accessToken: string | null = null;

export const setToken = (token?: any) => {
  // Case 1: Called with a direct token string
  if (typeof token === "string") {
    accessToken = token;
    localStorage.setItem("access_token", token);
    return;
  }


  const raw = localStorage.getItem("sb-cbbvploublqutmbiwwaq-auth-token");

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      accessToken = parsed.access_token;
      localStorage.setItem("access_token", parsed.access_token);
      return;
    } catch {}
  }


  if (token) {
    accessToken = token.access_token;
    localStorage.setItem("access_token", token.access_token);
  }
};


export const getToken = () => {
  // Si ya está en memoria, retornarlo
  if (accessToken) {
    return accessToken;
  }


  const stored = localStorage.getItem("access_token");
  if (stored) {
    accessToken = stored; /
    return stored;
  }

  const raw = localStorage.getItem("sb-cbbvploublqutmbiwwaq-auth-token");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.access_token) {
        accessToken = parsed.access_token;
        localStorage.setItem("access_token", parsed.access_token);
        return parsed.access_token;
      }
    } catch (error) {
      console.error("Error parsing Supabase token:", error);
    }
  }

  return null;
};

export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem("access_token");
};