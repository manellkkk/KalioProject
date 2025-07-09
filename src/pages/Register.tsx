import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css";
import KalioLogo from "../assets/logos/kalio_logo_extend.png";
import CPFInput from "../components/CPFInput";

function Register() {
  const navigate = useNavigate();

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

  // Função para validar CPF (pode colocar seu código de validação aqui)
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
    if (fullName.trim() !== "") setFullNameError("");
  }, [fullName]);

  useEffect(() => {
    if (username.trim() !== "") setUsernameError("");
  }, [username]);

  // Aqui validamos CPF automaticamente ao completar 11 dígitos
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
    if (username.trim() === "") {
      setUsernameError("O nome de usuário é obrigatório.");
      hasError = true;
    }
    const cpfDigits = cpfValue.replace(/\D/g, "");
    if (cpfDigits.length !== 11) {
      setCpfError("Digite um CPF válido com 11 dígitos.");
      hasError = true;
    } else if (!validarCPF(cpfDigits)) {
      setCpfError("CPF inválido.");
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
      await axios.post("http://localhost:5000/api/aluno/register", {
        nome: fullName,
        cpf: cpfValue,
        email,
        senha: password,
      });

      navigate("/login");
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
                protegidos pela LGPD e utilizados apenas para oferecer um
                serviço seguro, eficiente e personalizado.
              </p>
            </div>

            <div id="inputs" className="input-container">
              <input
                type="text"
                className="input-field"
                placeholder="NOME COMPLETO"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {fullNameError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {fullNameError}
                </p>
              )}

              <input
                type="text"
                className="input-field"
                placeholder="NOME DE USUÁRIO"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {usernameError}
                </p>
              )}

              <CPFInput className="input-field" onChange={setCpfValue} />
              {cpfError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {cpfError}
                </p>
              )}

              <input
                type="email"
                className="input-field"
                placeholder="E-MAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {emailError}
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

              <input
                type="password"
                className="input-field"
                placeholder="REPETIR SENHA"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {repeatPasswordError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "4px 0" }}
                >
                  {repeatPasswordError}
                </p>
              )}

              {serverError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", margin: "6px 0" }}
                >
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
                  onClick={() => navigate("/login")}
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
