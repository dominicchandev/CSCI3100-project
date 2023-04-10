import { useEffect, useState } from "react";

/**
 *
 * TODO: change localStorage to session
 *
 * authStatus: "loading" | "unauth" | "auth"
 */
export function useAuth() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check token exists
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAuthStatus("unauth");
      return;
    }
    setToken(token);
    setAuthStatus("auth");
  }, []);

  return { authStatus, accessToken: token };
}
