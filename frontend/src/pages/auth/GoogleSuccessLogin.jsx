import { useEffect, useRef } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccessLogin() {
  const hasRun = useRef(false);

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

        // ❌ User not found → logout + redirect to register
        if (res.status === 404) {
          await account.deleteSession("current");

          window.location.href =
            "/register?message=User does not exist. Please register first.";
          return;
        }

        if (!res.ok) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(
            result.message || "Login failed"
          )}`;
          return;
        }

        // ✅ Login success
        window.location.href = "/";

      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      }
    };

    processLogin();
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleSuccessLogin;