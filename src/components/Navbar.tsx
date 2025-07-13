import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import defaultProfilePic from "../assets/logos/profile_icon.jpg";
import loginIcon from "../assets/logos/login_icon.png";

const API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.startsWith("http")
    ? import.meta.env.VITE_API_URL
    : `https://${import.meta.env.VITE_API_URL}`
  : "http://localhost:5000";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // NOVO estado para bloquear renderização
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verifica login ao montar Navbar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/aluno/verify-token`, {
          credentials: "include", // envia cookies automaticamente
        });

        if (response.ok) {
          const data = await response.json();
          setLoggedIn(true);
          if (data.profilePicUrl) setProfilePic(data.profilePicUrl);
          if (data.username) setUsername(data.username);
        } else {
          setLoggedIn(false);
          setProfilePic(defaultProfilePic);
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        setLoggedIn(false);
        setProfilePic(defaultProfilePic);
      } finally {
        setCheckingAuth(false); // terminou a checagem
      }
    };
    checkAuth();
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/aluno/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Erro ao realizar logout no servidor.");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
    setLoggedIn(false);
    setProfilePic(defaultProfilePic);
    navigate("/", { replace: true });
    window.location.reload(); // força recarregar o estado da Navbar
  };

  // Se ainda está checando autenticação, não renderiza nada (ou pode renderizar um loader)
  if (checkingAuth) {
    return null; // ou um spinner simples se preferir
  }

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
              to="/curses"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Cursos
            </NavLink>
          </li>

          <li>
            {loggedIn ? (
              <div className="profile-container" ref={dropdownRef}>
                <img
                  src={profilePic}
                  alt="Perfil"
                  className="profile-pic"
                  onClick={() => setShowDropdown((prev) => !prev)}
                  style={{
                    cursor: "pointer",
                    width: "40px",
                    borderRadius: "50%",
                  }}
                />
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li className="greeting">
                      <p>
                        Olá, <span id="username">{username || "Usuário"}</span>!
                      </p>
                    </li>
                    <li>
                      <NavLink
                        className="menu__options"
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="menu__options"
                        to="/configuracoes"
                        onClick={() => setShowDropdown(false)}
                      >
                        Configurações
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="logout-button menu__options"
                      >
                        Sair
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <button className="btn">
                  <img id="login_icon" src={loginIcon} alt="Login Icon" />
                  Login
                </button>
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
