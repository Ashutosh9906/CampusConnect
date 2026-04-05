import googleLogo from "../../assets/google_logo.png";
import { account } from "../../config/appwrite";

function GoogleButton({ mode }) {
  const handleGoogleLogin = () => {
    const origin = window.location.origin;

    const successUrl =
      mode === "register"
        ? origin + "/auth/success-register"
        : origin + "/auth/success-login";

    account.createOAuth2Session(
      "google",
      successUrl,
      origin + "/auth/failure"
    );
  };

  return (
    <button className="google-auth-btn" onClick={handleGoogleLogin}>
      <img src={googleLogo} alt="Google" />
      Continue with Google
    </button>
  );
}

export default GoogleButton;