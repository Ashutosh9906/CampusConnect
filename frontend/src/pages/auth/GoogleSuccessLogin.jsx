import { useEffect, useRef, useState } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccessLogin() {
  const hasRun = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const processLogin = async () => {
      try {
        const user = await account.get();

        const res = await fetch("http://localhost:4000/auth/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: user.email,
          }),
        });

        const result = await res.json();

        // ❌ User not found → show message instead of redirect
        if (res.status === 404) {
          await account.deleteSession("current");

          setErrorMessage("Email does not exist. Please register first.");

          // Optional: redirect after 3 sec
          setTimeout(() => {
            window.location.href = "/register";
          }, 3000);

          return;
        }

        if (!res.ok) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(
            result.message || "Login failed"
          )}`;
          return;
        }

        // ✅ Login success
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";

      } catch (err) {
        console.error(err);
        window.location.href = "/login";
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