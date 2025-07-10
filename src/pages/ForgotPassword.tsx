import { useState } from "react";
import axios from "axios";
import CPFInput from "../components/CPFInput";
import "../assets/css/forgotPassword.css";

function ForgotPassword() {
  const [cpfValue, setCpfValue] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleForgotPassword = async () => {
    setError("");
    setSuccessMessage("");
    const cpfDigits = cpfValue.replace(/\D/g, "");

    if (!validarCPF(cpfDigits)) {
      setError("Digite um CPF válido.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/aluno/forgot-password", {
        cpf: cpfDigits,
      });

      setSuccessMessage(
        "Se o CPF estiver cadastrado e verificado, você receberá um e-mail para redefinir sua senha."
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao solicitar redefinição de senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <article>
        <div className="block">
          <h1>RECUPERAÇÃO DE SENHA</h1>

          <div className="input-container">
            <CPFInput
              className="input-field"
              placeholder="CPF"
              onChange={setCpfValue}
              value={cpfValue}
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: "8px" }}>
              {error}
            </p>
          )}
          {successMessage && (
            <p style={{ color: "green", fontSize: "0.9rem", marginTop: "8px" }}>
              {successMessage}
            </p>
          )}

          <button
            className="btn"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Enviando..." : "CONFIRMAR"}
          </button>
        </div>
      </article>
    </section>
  );
}

export default ForgotPassword;
