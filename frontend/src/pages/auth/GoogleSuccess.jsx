import { useEffect, useRef } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccess() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const processLogin = async () => {
      try {
        const user = await account.get();

        const res = await fetch("http://localhost:4000/auth/google-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appwriteUserId: user.$id,
            email: user.email,
            name: user.name,
          }),
        });

        const result = await res.json();

        // 🔥 If email already exists → redirect to login
        if (res.status === 409) {
          window.location.href = "/login?message=Account already exists. Please login.";
          return;
        }

        if (!res.ok) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(result.message)}`;
          return;
        }

        const profileComplete = result?.user?.profileComplete;

        if (profileComplete) {
          window.location.href = "/home";
        } else {
          window.location.href = "/complete-profile";
        }

      } catch (err) {
        const message = encodeURIComponent(err.message);
        window.location.href = `/auth/failure?message=${message}`;
      }
    };

    processLogin();
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleSuccess;