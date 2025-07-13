import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import "../assets/css/coursePage.css";

interface Professor {
  nome: string;
  bio: string;
  fotoUrl: string;
  cargo: string;
}

interface Modulo {
  idModulo: number;
  titulo: string;
}

interface CursoPagina {
  idCurso: number;
  nome: string;
  preco: number;
  dificuldade: string;
  descricao: string;
  salarioMedio: string | null;
  trailerYoutubeUrl: string | null;
  indicacoes: string[];
  professores: Professor[];
  modulos: Modulo[];
}

function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [curso, setCurso] = useState<CursoPagina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!slug) return;

    const fetchCurso = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/cursos/slug/${slug}`,
          {
            withCredentials: true,
          }
        );
        setCurso(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [slug]);

  const handleComprar = async () => {
    if (!curso) return;

    try {
      setLoadingPagamento(true);

      // Verifica se usuário está logado
      await axios.get("http://localhost:5000/api/aluno/verify-token", {
        withCredentials: true,
      });

      // Inicia pagamento
      console.log("Iniciando pagamento para idCurso:", curso.idCurso);
      const { data } = await axios.post(
        `http://localhost:5000/api/payment/${curso.idCurso}`,
        {},
        { withCredentials: true }
      );

      if (data.init_point) {
        window.location.href = data.init_point; // Redireciona para checkout
      } else {
        alert("Falha ao iniciar pagamento. Tente novamente.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Erro ao iniciar pagamento:", err);

        if (err.response?.status === 401) {
          navigate("/login", { state: { from: location.pathname } });
        } else {
          alert(err.response?.data?.error || "Erro ao iniciar pagamento.");
        }
      } else {
        console.error("Erro desconhecido ao iniciar pagamento:", err);
        alert("Erro ao iniciar pagamento.");
      }
    } finally {
      setLoadingPagamento(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Carregando curso...</p>
      </Layout>
    );
  }

  if (error || !curso) {
    return (
      <Layout>
        <p>{error || "Curso não encontrado."}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section">
        <article className="article">
          <div className="apresentacao__curso">
            <div id="compre__curso">
              <div>
                <h1>{curso.nome}</h1>
                <p>{curso.descricao}</p>
              </div>
              <div className="block">
                <h1>
                  COMPRE <span>AGORA!</span>
                </h1>
                <p id="preco">
                  <strong>Por apenas:</strong>{" "}
                  <span id="preco__text">
                    R$ <span id="preco__value">{curso.preco.toFixed(2)}</span>
                  </span>
                </p>
                <button
                  className="btn"
                  onClick={handleComprar}
                  disabled={loadingPagamento}
                >
                  {loadingPagamento ? "Processando..." : "COMPRAR"}
                </button>
              </div>
            </div>

            <div className="vantagens">
              <div className="vantagem">
                <strong>Dificuldade:</strong> {curso.dificuldade}
              </div>
              <div className="vantagem">
                <strong>Salário médio mensal:</strong>{" "}
                {curso.salarioMedio ?? "Não informado"}
              </div>
            </div>

            <div className="trailer">
              <h1>TRAILER DO CURSO</h1>
              <div className="video__centralized">
                {curso.trailerYoutubeUrl ? (
                  <div className="video">
                    <iframe
                      src={curso.trailerYoutubeUrl}
                      title="Trailer do Curso"
                      width="560"
                      height="315"
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <p>Trailer indisponível.</p>
                )}
              </div>
            </div>

            <div className="indicacoes">
              <h1>PARA QUEM É INDICADO?</h1>
              <ul>
                {curso.indicacoes.length > 0 ? (
                  curso.indicacoes.map((ponto, idx) => (
                    <li key={idx}>{ponto}</li>
                  ))
                ) : (
                  <li>Não há indicações disponíveis.</li>
                )}
              </ul>
            </div>

            <div className="professores">
              <h1>PROFESSORES</h1>
              {curso.professores.length > 0 ? (
                curso.professores.map((prof, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                      backgroundColor: "#222",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={prof.fotoUrl}
                      alt={prof.nome}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "16px",
                      }}
                    />
                    <div>
                      <h3 style={{ margin: "0 0 8px 0" }}>{prof.nome}</h3>
                      <p style={{ margin: "0 0 4px 0" }}>{prof.cargo}</p>
                      <p style={{ margin: 0 }}>{prof.bio}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Sem professores cadastrados.</p>
              )}
            </div>

            <div className="programa">
              <h1>Programa do Curso</h1>
              {curso.modulos.length > 0 ? (
                curso.modulos.map((modulo) => (
                  <div
                    key={modulo.idModulo}
                    style={{
                      backgroundColor: "#333",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <h3 style={{ margin: "0" }}>{modulo.titulo}</h3>
                  </div>
                ))
              ) : (
                <p>Programa não disponível.</p>
              )}
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export default CoursePage;
