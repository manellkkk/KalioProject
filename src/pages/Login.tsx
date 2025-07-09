import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import CPFInput from "../components/CPFInput";

// Função para validar CPF real
function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function Login() {
  const navigate = useNavigate();
  const [cpfValue, setCpfValue] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validação automática do CPF ao completar 11 dígitos
  useEffect(() => {
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length === 11) {
      if (!validarCPF(cpfDigits)) {
        setCpfError("CPF inválido.");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("");
    }
  }, [cpfValue]);

  // Limpar erro de senha ao digitar senha válida
  useEffect(() => {
    if (password.length >= 6) {
      setPasswordError("");
    }
  }, [password]);

  const handleLogin = () => {
    let hasError = false;
    const cpfDigits = cpfValue.replace(/\D/g, "");

    if (cpfDigits.length !== 11) {
      setCpfError("Digite um CPF válido com 11 dígitos.");
      hasError = true;
    } else if (!validarCPF(cpfDigits)) {
      setCpfError("CPF inválido.");
      hasError = true;
    } else {
      setCpfError("");
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!hasError) {
      alert("Login realizado com sucesso!");
      // Aqui você pode fazer a chamada para o backend para autenticar
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
                Na KALIO, a sua privacidade é uma prioridade. Todos os seus
                dados estão protegidos de acordo com a Lei Geral de Proteção de
                Dados (LGPD). Utilizamos suas informações apenas para oferecer
                um serviço seguro, eficiente e personalizado. Garantimos total
                sigilo, segurança e transparência no tratamento dos seus dados.
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

              <div id="button">
                <button className="btn" onClick={handleLogin}>
                  ENTRAR
                </button>
              </div>
            </div>

            <div id="options__width">
              <div id="options" className="centralized">
                <p onClick={() => navigate("/register", { replace: true })}>
                  Registre-se
                </p>
                <p
                  onClick={() =>
                    navigate("/forgot-password", { replace: true })
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
