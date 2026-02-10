import googleLogo from "../../assets/google_logo.png";

function GoogleButton() {
  return (
    <button className="google-auth-btn">
      <img src={googleLogo} alt="Google" />
      Continue with Google
    </button>
  );
}

export default GoogleButton;
