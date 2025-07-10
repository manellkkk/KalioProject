import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/css/forgotPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token") || "";

  const [senha, setSenha] = useState("");
  const [repitaSenha, setRepitaSenha] = useState("");

  const [senhaError, setSenhaError] = useState("");
  const [repitaSenhaError, setRepitaSenhaError] = useState("");

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Redireciona para home se não tiver token
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Limpa erro se senha tiver 6+ caracteres
  useEffect(() => {
    if (senha.length >= 6 && senhaError) {
      setSenhaError("");
    }
  }, [senha, senhaError]);

  // Limpa erro se senhas coincidirem
  useEffect(() => {
    if (repitaSenha === senha && repitaSenhaError) {
      setRepitaSenhaError("");
    }
  }, [repitaSenha, senha, repitaSenhaError]);

  const handleSubmit = async () => {
    setServerError("");
    let hasError = false;

    if (senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }
    if (repitaSenha !== senha) {
      setRepitaSenhaError("As senhas não coincidem.");
      hasError = true;
    }

    if (hasError) return;

    try {
      await axios.post("http://localhost:5000/api/aluno/reset-password", {
        token,
        novaSenha: senha,
      });

      setSuccessMessage("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setServerError(error.response.data.error || "Erro desconhecido.");
        } else {
          setServerError(error.message);
        }
      } else {
        setServerError("Erro ao redefinir a senha.");
      }
    }
  };

  return (
    <section>
      <article>
        <div className="block">
          <h1>DEFINA SUA SENHA</h1>
          <div className="input-container">
            <input
              className="input-field"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {senhaError && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>{senhaError}</p>
            )}
          </div>
          <div className="input-container">
            <input
              className="input-field"
              type="password"
              placeholder="Repita a senha"
              value={repitaSenha}
              onChange={(e) => setRepitaSenha(e.target.value)}
            />
            {repitaSenhaError && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>
                {repitaSenhaError}
              </p>
            )}
          </div>
          <button className="btn" onClick={handleSubmit}>
            CONFIRMAR
          </button>

          {serverError && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>{serverError}</p>
          )}

          {successMessage && (
            <p style={{ color: "green", fontSize: "0.9rem" }}>
              {successMessage}
            </p>
          )}
        </div>
      </article>
    </section>
  );
}

export default ResetPassword;
