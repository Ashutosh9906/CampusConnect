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
        console.log(user);

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

        // ❌ User not found
        if (res.status === 404) {
          await account.deleteSession("current"); // cleanup
          window.location.href = `/login?message=${result.message}`;
          return;
        }

        // ❌ Server error
        if (res.status === 500 && !result.success) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(
            result.message || "Registration failed"
          )}`;
          return;
        }

        // ✅ SUCCESS → now safe to delete Appwrite session
        try {
          await account.deleteSession("current");
        } catch (err) {
          console.log("Session cleanup failed (safe to ignore)");
        }

        // ✅ Store user
        localStorage.setItem("user", JSON.stringify(result.user));

        window.location.href = "/";

      } catch (err) {
        console.error(err);
        window.location.href = `/login?message=${err.message}`;
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