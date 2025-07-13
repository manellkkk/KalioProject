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

interface Area {
  idArea: number;
  nome: string;
}

interface Linguagem {
  idLinguagem: number;
  nome: string;
}

const API_URL = import.meta.env.VITE_API_URL;

function Curses() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros fixos
  const dificuldades = ["Todas", "Iniciante", "Intermediário", "Avançado"];

  // estados para filtros dinâmicos
  const [areas, setAreas] = useState<Area[]>([]);
  const [linguagens, setLinguagens] = useState<Linguagem[]>([]);

  const [filtroDificuldade, setFiltroDificuldade] = useState("Todas");
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [filtroLinguagem, setFiltroLinguagem] = useState("Todas");
  const [busca, setBusca] = useState("");

  // Buscar áreas e linguagens ao montar o componente
  useEffect(() => {
    async function fetchFiltros() {
      try {
        const [areaRes, linguagemRes] = await Promise.all([
          axios.get<Area[]>(`${API_URL}/api/areas`),
          axios.get<Linguagem[]>(`${API_URL}/api/linguagens`),
        ]);

        setAreas(areaRes.data);
        setLinguagens(linguagemRes.data);
      } catch (error) {
        console.error("Erro ao carregar filtros:", error);
      }
    }

    fetchFiltros();
  }, []);

  // Buscar cursos com base nos filtros
  useEffect(() => {
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/cursos/filter`, {
          params: {
            dificuldade: filtroDificuldade,
            area: filtroArea,
            linguagem: filtroLinguagem,
            busca: busca.trim(),
          },
        });
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
                  {dificuldades.map((nivel) => (
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
                  ))}
                </div>
              </div>

              {/* Área */}
              <div className="filter">
                <h2>ÁREA</h2>
                <div>
                  {/* Sempre exibe a opção "Todas" */}
                  <div className="option" key="todas-area">
                    <input
                      type="radio"
                      name="area"
                      id="area-todas"
                      checked={filtroArea === "Todas"}
                      onChange={() => setFiltroArea("Todas")}
                    />
                    <label htmlFor="area-todas">Todas</label>
                  </div>

                  {/* Agora as áreas dinâmicas */}
                  {areas.map((area) => (
                    <div className="option" key={area.idArea}>
                      <input
                        type="radio"
                        name="area"
                        id={`area-${area.nome
                          .toLowerCase()
                          .replace(/\s+/g, "")}`}
                        checked={filtroArea === area.nome}
                        onChange={() => setFiltroArea(area.nome)}
                      />
                      <label
                        htmlFor={`area-${area.nome
                          .toLowerCase()
                          .replace(/\s+/g, "")}`}
                      >
                        {area.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linguagem */}
              <div className="filter">
                <h2>LINGUAGEM</h2>
                <div>
                  {/* Sempre exibe "Todas" */}
                  <div className="option" key="todas-linguagem">
                    <input
                      type="radio"
                      name="linguagem"
                      id="linguagem-todas"
                      checked={filtroLinguagem === "Todas"}
                      onChange={() => setFiltroLinguagem("Todas")}
                    />
                    <label htmlFor="linguagem-todas">Todas</label>
                  </div>

                  {/* Linguagens dinâmicas */}
                  {linguagens.map((linguagem) => (
                    <div className="option" key={linguagem.idLinguagem}>
                      <input
                        type="radio"
                        name="linguagem"
                        id={`linguagem-${linguagem.nome
                          .toLowerCase()
                          .replace(/\s+|\/+/g, "")}`}
                        checked={filtroLinguagem === linguagem.nome}
                        onChange={() => setFiltroLinguagem(linguagem.nome)}
                      />
                      <label
                        htmlFor={`linguagem-${linguagem.nome
                          .toLowerCase()
                          .replace(/\s+|\/+/g, "")}`}
                      >
                        {linguagem.nome}
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
