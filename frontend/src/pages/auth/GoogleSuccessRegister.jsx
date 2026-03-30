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
        console.log("register user -> ", user);

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

        if (res.status == 409 && !result.isNewUser) {
          await account.deleteSession("current");
          window.location.href =
            "/login?message=User already exists. Please login.";
          return;
        }

        if (res.status == 500 && !result.success) {
          window.location.href = `/auth/failure?message=${encodeURIComponent(
            result.message || "Registration failed"
          )}`;
          return;
        }

        window.location.href = "/complete-profile";

      } catch (err) {
        console.error(err);
        window.location.href = `/register?message=${err.message}`;
      }
    };

    processRegister();
  }, []);

  return <p>Setting up your account...</p>;
}

export default GoogleSuccessRegister;