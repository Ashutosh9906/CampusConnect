import googleLogo from "../../assets/google_logo.png";
import { account } from "../../config/appwrite";

function GoogleButton() {
  const handleGoogleLogin = () => {
    const origin = window.location.origin;

    account.createOAuth2Session(
      "google",
      origin + "/auth/success",
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
