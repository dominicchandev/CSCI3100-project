import { useEffect, useState } from "react";

/**
 *
 * authStatus: "loading" | "unauth" | "auth"
 */
export function useAuth() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState("");

  console.log(`token: ${token}`);
  console.log(`authStatus: ${authStatus}`);

  useEffect(() => {
    // try {
    (async () => {
      // Check token exists
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthStatus("unauth");
        return;
      }

      const result = await fetch(`http://localhost:8000/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultJson = await result.json();
      console.log(`Read me result:`);
      console.log(resultJson);
      setToken(token);
      setAuthStatus("auth");
      setCourses(resultJson.courses);
      setEmail(resultJson.email);
    })();
  }, []);

  return { authStatus, accessToken: token, email, courses };
}
