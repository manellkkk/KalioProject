import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // importação para rotas
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import loginIcon from "../assets/logos/login_icon.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <NavLink to="/">
          <img src={KalioLogo} alt="Kalio Logo" />
        </NavLink>
      </div>

      <div className="navbar_list">
        <ul>
          <li>
            <NavLink
              to="/cursos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Cursos
            </NavLink>
          </li>
          <li className="login_icon">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <button className="btn">
                <img src={loginIcon} alt="Login Icon" />
                Login
              </button>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
