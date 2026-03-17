import { useEffect, useRef } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccessRegister() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const processRegister = async () => {
      try {
        const user = await account.get();

        const res = await fetch("http://localhost:4000/auth/google-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            appwriteUserId: user.$id,
            email: user.email,
            name: user.name,
          }),
        });

        const result = await res.json();

        // ❌ User already exists → logout + go to login
        if (res.status === 200 && !result.isNewUser) {
          await account.deleteSession("current");

          window.location.href =
            "/login?message=User already exists. Please login.";
          return;
        }

        if (!res.ok) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(
            result.message || "Registration failed"
          )}`;
          return;
        }

        // ✅ New user → complete profile
        window.location.href = "/complete-profile";

      } catch (err) {
        console.error(err);
        window.location.href = "/register";
      }
    };

    processRegister();
  }, []);

  return <p>Setting up your account...</p>;
}

export default GoogleSuccessRegister;