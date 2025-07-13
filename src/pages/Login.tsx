import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const response = await fetch(`${API_URL}/api/aluno/verify-token`, {
          credentials: "include", // importantíssimo para enviar cookie
        });
        if (response.ok) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    }
    checkIfLoggedIn();
  }, [navigate]);

  useEffect(() => {
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length === 11) {
      if (!validarCPF(cpfDigits)) setCpfError("CPF inválido.");
      else setCpfError("");
    } else {
      setCpfError("");
    }
  }, [cpfValue]);

  useEffect(() => {
    if (password.length >= 6) setPasswordError("");
  }, [password]);

  async function handleLogin() {
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
        credentials: "include", // importante para cookie cross-site
        body: JSON.stringify({ cpf: cpfDigits, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Erro ao realizar login.");
      } else {
        navigate(lastPage);
      }
    } catch (error) {
      console.error(error);
      setServerError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <input
        type="text"
        placeholder="CPF"
        value={cpfValue}
        onChange={(e) => setCpfValue(e.target.value)}
      />
      {cpfError && <p style={{ color: "red" }}>{cpfError}</p>}

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </section>
  );
}

export default Login;
