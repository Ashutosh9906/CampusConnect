import googleLogo from "../../assets/google_logo.png";
import { account } from "../../config/appwrite";

function GoogleButton() {
  const handleGoogleLogin = () => {
    account.createOAuth2Token(
      "google",
      window.location.origin + "/auth/success",
      window.location.origin + "/auth/failure"
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
