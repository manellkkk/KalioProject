import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/login.css";
import "../assets/css/verifyEmail.css";
import EmailIcon from "../assets/logos/email_icon.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function VerifyEmail() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const token =
    location.state?.token ||
    new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleVerifyCode = async () => {
    setError("");
    setSuccess("");

    if (!codigo.trim()) {
      setError("Digite o código de verificação.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/aluno/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, codigo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao verificar código.");
      } else {
        setSuccess("Email verificado com sucesso!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao conectar com o servidor.");
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResendLoading) return;

    setIsResendLoading(true);
    setResendSuccess("");
    setResendError("");

    try {
      const response = await fetch(
        `${API_URL}/api/aluno/resend-verification-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResendError(data.error || "Erro ao reenviar código.");
      } else {
        setResendSuccess("Código reenviado com sucesso! Verifique seu email.");
        // Inicia cooldown de 10 segundos
        setResendCooldown(10);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setResendError("Erro ao conectar com o servidor.");
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <section>
      <article>
        <div className="block">
          <div id="confirm">
            <img src={EmailIcon} alt="Ícone de email" />
            <h1>Confirmação de Email</h1>
          </div>
          <div className="input-container">
            <input
              type="text"
              className="input-field"
              placeholder="CÓDIGO DE VERIFICAÇÃO"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
          {success && (
            <p style={{ color: "green", fontSize: "0.9rem" }}>{success}</p>
          )}
          {resendError && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>{resendError}</p>
          )}
          {resendSuccess && (
            <p style={{ color: "green", fontSize: "0.9rem" }}>
              {resendSuccess}
            </p>
          )}

          <button className="btn" onClick={handleVerifyCode}>
            CONFIRMAR
          </button>

          <button
            className="btn"
            style={{
              marginTop: "10px",
              cursor:
                resendCooldown > 0 || isResendLoading
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isResendLoading}
          >
            {isResendLoading
              ? "Reenviando..."
              : resendCooldown > 0
              ? `Aguarde ${resendCooldown}s`
              : "REENVIAR CÓDIGO"}
          </button>
        </div>
      </article>
    </section>
  );
}

export default VerifyEmail;
