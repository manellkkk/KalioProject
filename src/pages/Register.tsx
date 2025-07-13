import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css";
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import CPFInput from "../components/CPFInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPage = location.state?.from || "/home";

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [cpfValue, setCpfValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const response = await fetch(`${API_URL}/api/aluno/verify-token`, {
          credentials: "include",
        });

        if (response.ok) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };

    checkIfLoggedIn();
  }, [navigate]);

  useEffect(() => {
    if (fullName.trim() !== "") setFullNameError("");
  }, [fullName]);

  useEffect(() => {
    const nome = username.trim();
    if (nome === "") {
      setUsernameError("");
      return;
    }
    if (nome.length > 16) {
      setUsernameError("O nome de usuário deve ter no máximo 16 caracteres.");
      return;
    }
    const regex = /^[a-zA-Z0-9._]+$/;
    if (!regex.test(nome)) {
      setUsernameError(
        "O nome de usuário só pode conter letras, números, ponto (.) e underline (_), sem espaços."
      );
    } else {
      setUsernameError("");
    }
  }, [username]);

  useEffect(() => {
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length === 11) {
      setCpfError(validarCPF(cpfDigits) ? "" : "CPF inválido.");
    } else {
      setCpfError("");
    }
  }, [cpfValue]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) setEmailError("");
  }, [email]);

  useEffect(() => {
    if (password.length >= 6) setPasswordError("");
  }, [password]);

  useEffect(() => {
    if (repeatPassword === password) setRepeatPasswordError("");
  }, [repeatPassword, password]);

  const handleRegister = async () => {
    setServerError("");
    let hasError = false;

    if (fullName.trim() === "") {
      setFullNameError("O nome completo é obrigatório.");
      hasError = true;
    }
    const nomeUsuarioTrim = username.trim();
    if (nomeUsuarioTrim === "") {
      setUsernameError("O nome de usuário é obrigatório.");
      hasError = true;
    } else {
      const regex = /^[a-zA-Z0-9._]{1,16}$/;
      if (!regex.test(nomeUsuarioTrim)) {
        setUsernameError(
          "O nome de usuário só pode conter letras, números, ponto (.) e underline (_), sem espaços, e até 16 caracteres."
        );
        hasError = true;
      }
    }
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length !== 11 || !validarCPF(cpfDigits)) {
      setCpfError("Digite um CPF válido com 11 dígitos.");
      hasError = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Digite um e-mail válido.");
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }
    if (repeatPassword !== password) {
      setRepeatPasswordError("As senhas não coincidem.");
      hasError = true;
    }

    if (hasError) return;

    try {
      await axios.post(`${API_URL}/api/aluno/register`, {
        nome: fullName,
        nomeUsuario: username,
        cpf: cpfDigits,
        email,
        senha: password,
      });
      navigate("/login", { state: { from: lastPage } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.error);
      } else {
        setServerError("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <section>
      <article>
        <div className="block__login">
          <div className="login__left">
            <img src={KalioLogo} alt="Kalio Logo" />
          </div>
          <div className="login__right">
            <div id="entry" className="centralized">
              <h1>REGISTRAR</h1>
              <p id="LGPD">
                Na KALIO, sua privacidade é prioridade. Seus dados são
                protegidos pela LGPD.
              </p>
            </div>

            <div id="inputs" className="input-container">
              <input
                type="text"
                className="input-field"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {fullNameError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {fullNameError}
                </p>
              )}

              <input
                type="text"
                className="input-field"
                placeholder="Nome de Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {usernameError}
                </p>
              )}

              <CPFInput className="input-field" onChange={setCpfValue} />
              {cpfError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>{cpfError}</p>
              )}

              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>{emailError}</p>
              )}

              <input
                type="password"
                className="input-field"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {passwordError}
                </p>
              )}

              <input
                type="password"
                className="input-field"
                placeholder="Repita a senha"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {repeatPasswordError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {repeatPasswordError}
                </p>
              )}

              {serverError && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {serverError}
                </p>
              )}

              <div id="button">
                <button className="btn" onClick={handleRegister}>
                  REGISTRAR
                </button>
              </div>
            </div>

            <div id="options__width">
              <div className="centralized">
                <p
                  style={{ cursor: "pointer", color: "#007bff" }}
                  onClick={() => navigate(-1)}
                >
                  Já possui cadastro? Faça login
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Register;
