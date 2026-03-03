import { account } from "../../config/appwrite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../../assets/cc-logo.png";
import "../../styles/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const loggedUser = await account.get();
        setUser(loggedUser);
      } catch {
        setUser(null);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-pill-full">

        <div className="navbar-logo-wrap">
          <img src={logo} alt="Campus Connect" />
        </div>

        <div className="navbar-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="navbar-action">
          {user ? (
            <div className="profile-wrapper">
              <span className="profile-btn">
                {user.name || "My Profile"}
              </span>

              <div className="profile-dropdown">
                <NavLink to="/profile">View Profile</NavLink>
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn">
              Login
            </NavLink>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
