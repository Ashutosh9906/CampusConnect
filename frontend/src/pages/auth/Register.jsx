import "../../styles/auth.css";
import "../../styles/form.css";
import illustration from "../../assets/login-illustration.svg";
import EmailForm from "../../components/auth/EmailForm";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Left Panel (same as Login) */}
        <div className="auth-left">
          <img src={illustration} alt="Campus Connect" />
          <h2>Campus Connect</h2>
          <p>Create your account to access all campus events in one place</p>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <EmailForm />
        </div>

      </div>
    </div>
  );
}

export default Register;
