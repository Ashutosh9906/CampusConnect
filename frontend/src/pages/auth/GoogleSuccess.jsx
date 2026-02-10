import { useEffect } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccess() {
  useEffect(() => {
    const processLogin = async () => {
      try {
        const user = await account.get();

        const res = await fetch("http://localhost:4000/auth/google-login", {
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
        console.log("Backend result:", result);

        const profileComplete = result?.data?.profileComplete;

        if (profileComplete) {
          window.location.href = "/home";
        } else {
          window.location.href = "/complete-profile";
        }

      } catch (err) {
        console.error(err);
        const message = encodeURIComponent(err.message);
        window.location.href = `/auth/failure?message=${message}`;
      }
    };

    processLogin();
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleSuccess;
