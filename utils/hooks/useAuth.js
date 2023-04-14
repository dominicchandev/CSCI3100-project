import { useEffect, useRef, useState } from "react";

/**
 *
 * authStatus: "loading" | "unauth" | "auth"
*/
export function useAuth() {
  const [token, setToken] = useState("");
  const token_expired = useRef(false)
  const [authStatus, setAuthStatus] = useState("loading");
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("")

  function refreshAuthData() {
    const local_token = localStorage.getItem("accessToken");
    if (!local_token) {
      setAuthStatus("unauth");
    }
    fetch(process.env.NEXT_PUBLIC_SERVER + `api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${local_token}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
      token_expired.current = false;
      setCourses(data.courses);
      setEmail(data.email);
      setName(data.name);
      setRole(data.role);
      setUserId(data.userId);
    })
    .catch((err) => {
      token_expired.current = true;
    })
    .finally(() => {
      console.log("ER");
      console.log(courses);
      setToken(local_token)
    })
  }
  
  useEffect(() => {
    if (token != "" && token_expired.current === false) {
      setAuthStatus("auth")
    }
    if (token_expired.current == true) {
      setAuthStatus("unauth")
    }
  }, [token])

  // Check token exists
  useEffect(() => {
    const local_token = localStorage.getItem("accessToken");
    if (!local_token) {
      setAuthStatus("unauth");
    }
  
    fetch(process.env.NEXT_PUBLIC_SERVER + `api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${local_token}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
      token_expired.current = false;
      setCourses(data.courses);
      setEmail(data.email);
      setName(data.name);
      setRole(data.role);
      setUserId(data.userId);
    })
    .catch((err) => {
      token_expired.current = true;
    })
    .finally(() => {
      setToken(local_token)
    })
  }, [])
  
  return { authStatus, token, email, courses, name , role, userId, refreshAuthData};

}

