import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../config/appwrite";

function GoogleSuccessLogin() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const processLogin = async () => {
      try {
        const user = await account.get();

        const res = await fetch(`${API}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: user.email }),
        });

        const result = await res.json();

        if (res.status === 404) {
          await account.deleteSession("current");
          navigate(`/login?message=${result.message}`);
          return;
        }

        if (res.status === 500 && !result.success) {
          navigate(`/auth/failure?message=${encodeURIComponent(result.message || "Login failed")}`);
          return;
        }

        try {
          await account.deleteSession("current");
        } catch (err) {
          console.log("Session cleanup failed (safe to ignore)");
        }

        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
      } catch (err) {
        console.error(err);
        navigate(`/login?message=${encodeURIComponent(err.message)}`);
      }
    };

    processLogin();
  }, []);

  return (
    <div>
      {errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <p>Signing you in...</p>
      )}
    </div>
  );
}

export default GoogleSuccessLogin;