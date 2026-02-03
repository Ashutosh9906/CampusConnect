import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/form.css";
import illustration from "../../assets/login-illustration.svg";
import googleIcon from "../../assets/google_logo.png";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-left">
          <img src={illustration} alt="Campus Connect" />
          <h2>Campus Connect</h2>
          <p>One platform for campus events</p>
        </div>

        <div className="auth-right">
          <h3>Sign In</h3>

          <div className="form-group">
            <label>Email</label>
            <input type="email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" />
          </div>

          <button className="btn-primary">Sign In</button>

          <div className="divider"><span>or</span></div>

          <button className="btn-google">
            <img src={googleIcon} alt="Google" />
            Sign in with Google
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
