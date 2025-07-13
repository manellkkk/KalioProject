import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../assets/css/curses.css";
import axios from "axios";

interface Curso {
  idCurso: number;
  nome: string;
  link: string;
  preco: number;
  dificuldade: string;
  area: string;
  linguagem: string;
}

function Curses() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroDificuldade, setFiltroDificuldade] = useState("Todas");
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [filtroLinguagem, setFiltroLinguagem] = useState("Todas");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/cursos/filter",
          {
            params: {
              dificuldade: filtroDificuldade,
              area: filtroArea,
              linguagem: filtroLinguagem,
              busca: busca.trim(),
            },
          }
        );
        setCursos(response.data);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [filtroDificuldade, filtroArea, filtroLinguagem, busca]);

  return (
    <Layout>
      <section>
        <article>
          {/* FILTROS */}
          <div className="filters">
            <div>
              {/* Dificuldade */}
              <div>
                <h2>DIFICULDADE</h2>
                <div>
                  {["Todas", "Iniciante", "Intermediário", "Avançado"].map(
                    (nivel) => (
                      <div className="option" key={nivel}>
                        <input
                          type="radio"
                          name="dificuldade"
                          id={`dificuldade-${nivel.toLowerCase()}`}
                          checked={filtroDificuldade === nivel}
                          onChange={() => setFiltroDificuldade(nivel)}
                        />
                        <label htmlFor={`dificuldade-${nivel.toLowerCase()}`}>
                          {nivel}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Área */}
              <div className="filter">
                <h2>ÁREA</h2>
                <div>
                  {[
                    "Todas",
                    "Programação",
                    "Desenvolvimento Web",
                    "Banco de Dados",
                    "Hardware",
                  ].map((area) => (
                    <div className="option" key={area}>
                      <input
                        type="radio"
                        name="area"
                        id={`area-${area.toLowerCase().replace(/\s+/g, "")}`}
                        checked={filtroArea === area}
                        onChange={() => setFiltroArea(area)}
                      />
                      <label
                        htmlFor={`area-${area
                          .toLowerCase()
                          .replace(/\s+/g, "")}`}
                      >
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linguagem */}
              <div className="filter">
                <h2>LINGUAGEM</h2>
                <div>
                  {[
                    "Todas",
                    "Python",
                    "JavaScript Web",
                    "Java",
                    "HTML / CSS",
                  ].map((linguagem) => (
                    <div className="option" key={linguagem}>
                      <input
                        type="radio"
                        name="linguagem"
                        id={`linguagem-${linguagem
                          .toLowerCase()
                          .replace(/\s+|\/+/g, "")}`}
                        checked={filtroLinguagem === linguagem}
                        onChange={() => setFiltroLinguagem(linguagem)}
                      />
                      <label
                        htmlFor={`linguagem-${linguagem
                          .toLowerCase()
                          .replace(/\s+|\/+/g, "")}`}
                      >
                        {linguagem}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PESQUISA */}
          <div className="curses__right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Pesquisar cursos..."
                className="search-input"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* LISTAGEM */}
            <div className="curses__list">
              {loading ? (
                <p>Carregando cursos...</p>
              ) : cursos.length === 0 ? (
                <p>Não há cursos disponíveis no momento.</p>
              ) : (
                cursos.map((curso) => (
                  <div className="block__curse" key={curso.idCurso}>
                    <div className="title__curse">
                      <div className="tags">
                        <div className="tags__decoration">
                          <p>{curso.dificuldade}</p>
                        </div>
                        <div className="tags__decoration">
                          <p>{curso.area}</p>
                        </div>
                        <div className="tags__decoration">
                          <p>{curso.linguagem}</p>
                        </div>
                      </div>
                      <h1>{curso.nome}</h1>
                    </div>
                    <a href={`/curses/${curso.link}`}>
                      <button className="btn btnSaibaMais">Ver curso</button>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export default Curses;
