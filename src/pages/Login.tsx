import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/login.css";
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import CPFInput from "../components/CPFInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Função para validar CPF
function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPage = location.state?.from || "/";

  const [cpfValue, setCpfValue] = useState("");
  const [password, setPassword] = useState("");

  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verifica se já está logado ao carregar a página
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const response = await fetch(`${API_URL}/api/aluno/verify-token`, {
          credentials: "include",
        });
        if (response.ok) {
          navigate(lastPage, { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };
    checkIfLoggedIn();
  }, [navigate, lastPage]);

  // Validação CPF ao digitar
  useEffect(() => {
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length === 11) {
      setCpfError(validarCPF(cpfDigits) ? "" : "CPF inválido.");
    } else {
      setCpfError("");
    }
  }, [cpfValue]);

  // Validação senha ao digitar
  useEffect(() => {
    if (password.length >= 6) setPasswordError("");
  }, [password]);

  const handleLogin = async () => {
    setServerError("");
    let hasError = false;
    const cpfDigits = cpfValue.replace(/\D/g, "");

    if (cpfDigits.length !== 11 || !validarCPF(cpfDigits)) {
      setCpfError("Digite um CPF válido com 11 dígitos.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/aluno/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cpf: cpfDigits, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o backend indicar que o email não está confirmado, redireciona
        if (data.redirect === "/verify-email") {
          navigate("/verify-email");
        } else {
          setServerError(data.error || "Erro ao realizar login.");
        }
      } else {
        navigate(lastPage);
      }
    } catch (error) {
      console.error(error);
      setServerError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
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
              <h1>ENTRAR</h1>
              <p id="LGPD">
                Na KALIO, sua privacidade é prioridade. Seus dados são
                protegidos pela LGPD e utilizados apenas para oferecer um
                serviço seguro e personalizado.
              </p>
            </div>

            <div id="inputs" className="input-container">
              <CPFInput className="input-field" onChange={setCpfValue} />
              {cpfError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {cpfError}
                </p>
              )}

              <input
                type="password"
                className="input-field"
                placeholder="SENHA"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {passwordError}
                </p>
              )}

              {serverError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {serverError}
                </p>
              )}

              <div id="button">
                <button
                  className="btn"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "ENTRAR"}
                </button>
              </div>
            </div>

            <div id="options__width">
              <div id="options" className="centralized">
                <p
                  onClick={() =>
                    navigate("/register", { state: { from: lastPage } })
                  }
                >
                  Registre-se
                </p>
                <p
                  onClick={() =>
                    navigate("/forgot-password", { state: { from: lastPage } })
                  }
                >
                  Esqueceu a senha?
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Login;
