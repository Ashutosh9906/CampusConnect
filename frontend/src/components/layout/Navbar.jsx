import { NavLink } from "react-router-dom";
import logo from "../../assets/cc-logo.png";
import "../../styles/navbar.css";

function Navbar() {
  const isLoggedIn = false; // mock login

  return (
    <nav className="navbar-container">
      <div className="navbar-pill-full">
        {/* Logo */}
        <div className="navbar-logo-wrap">
          <img src={logo} alt="Campus Connect" />
        </div>

        {/* Links */}
        <div className="navbar-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        {/* Profile */}
        <div className="navbar-action">
          <div className="profile-wrapper">
            <span className="profile-btn">My Profile</span>

            <div className="profile-dropdown">
              <NavLink to="/profile">View Profile</NavLink>
              <button>Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
