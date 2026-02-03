import { useNavigate } from "react-router-dom";

function EmailForm() {
  const navigate = useNavigate();

  return (
    <>
      <h3>Register</h3>

      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="college@email.edu" />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Create a password" />
      </div>

      <button className="btn-primary" onClick={() => navigate("/verify-otp")}>
        Verify Email
      </button>
    </>
  );
}

export default EmailForm;
