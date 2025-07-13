import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  nome: string;
  preco: number;
  dificuldade: string;
  descricao: string;
  salarioMedio?: string;
  trailerYoutubeUrl?: string;
  indicacoes: string[];
  professores: Professor[];
  modulos: Modulo[];
}

function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [curso, setCurso] = useState<CursoPagina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchCurso = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/cursopagina/${slug}`
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
                <button className="btn">COMPRAR</button>
              </div>
            </div>
            <div className="vantagens">
              <div className="vantagem">
                <strong>Dificuldade:</strong> {curso.dificuldade}
              </div>
              <div className="vantagem">
                <strong>Salário médio mensal:</strong> {curso.salarioMedio}
              </div>
              <div></div>
            </div>
            <div className="trailer">
              <h1>TRAILER DO CURSO</h1>
              <div className="video__centralized">
                {curso.trailerYoutubeUrl && (
                  <div className="video">
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                      }}
                    >
                      <iframe
                        src={curso.trailerYoutubeUrl}
                        title="Trailer do Curso"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="indicacoes">
              <h1>PARA QUEM É INDICADO?</h1>
              <p>
                <ul>
                  {curso.indicacoes.map((ponto, idx) => (
                    <li key={idx}>{ponto}</li>
                  ))}
                </ul>
              </p>
            </div>
            <div className="professores">
              <h1>PROFESSORES</h1>
              {curso.professores.map((prof, idx) => (
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
              ))}
            </div>
            <div className="programa">
              <h1>Programa do Curso</h1>
              {curso.modulos.map((modulo) => (
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
              ))}
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export default CoursePage;
