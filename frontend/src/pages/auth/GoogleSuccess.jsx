import { useEffect } from "react";
import { account } from "../../config/appwrite";

function GoogleSuccess() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        console.log("Google user:", user);

        // later we will send this to backend
        window.location.href = "/";
      } catch (err) {
        console.error(err);
        window.location.href = "/auth/failure";
      }
    };

    fetchUser();
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleSuccess;
