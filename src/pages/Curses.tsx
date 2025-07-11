import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import "../assets/css/curses.css";
import axios from "axios";

interface Curso {
  idCurso: number;
  nome: string;
  link: string;
  preco: number;
  area: string;
  linguagem: string;
  dificuldade: string;
}

function Curses() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [dificuldade, setDificuldade] = useState<string>("Todas");
  const [area, setArea] = useState<string>("Todas");
  const [linguagem, setLinguagem] = useState<string>("Todas");

  const fetchCursos = useCallback(async () => {
    try {
      const params = { dificuldade, area, linguagem };
      const response = await axios.get("http://localhost:3000/cursos/filter", {
        params,
      });
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  }, [dificuldade, area, linguagem]);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  return (
    <Layout>
      <section>
        <article>
          <div className="filters">
            <div>
              <div>
                <h2>DIFICULDADE</h2>
                <div>
                  {["Todas", "Iniciante", "Intermediário", "Avançado"].map(
                    (dif) => (
                      <div className="option" key={dif}>
                        <input
                          type="radio"
                          name="dificuldade"
                          id={dif.toLowerCase()}
                          checked={dificuldade === dif}
                          onChange={() => setDificuldade(dif)}
                        />
                        <label htmlFor={dif.toLowerCase()}>{dif}</label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="filter">
                <h2>ÁREA</h2>
                <div>
                  {[
                    "Todas",
                    "Programação",
                    "Desenvolvimento Web",
                    "Banco de Dados",
                    "Hardware",
                  ].map((ar) => (
                    <div className="option" key={ar}>
                      <input
                        type="radio"
                        name="area"
                        id={ar.toLowerCase().replace(/ /g, "-")}
                        checked={area === ar}
                        onChange={() => setArea(ar)}
                      />
                      <label htmlFor={ar.toLowerCase().replace(/ /g, "-")}>
                        {ar}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter">
                <h2>LINGUAGEM</h2>
                <div>
                  {[
                    "Todas",
                    "Python",
                    "JavaScript Web",
                    "Java",
                    "HTML / CSS",
                  ].map((ling) => (
                    <div className="option" key={ling}>
                      <input
                        type="radio"
                        name="linguagem"
                        id={ling
                          .toLowerCase()
                          .replace(/ /g, "")
                          .replace("/", "")}
                        checked={linguagem === ling}
                        onChange={() => setLinguagem(ling)}
                      />
                      <label
                        htmlFor={ling
                          .toLowerCase()
                          .replace(/ /g, "")
                          .replace("/", "")}
                      >
                        {ling}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="curses__right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Pesquisar cursos..."
                className="search-input"
                disabled
              />
            </div>

            <div className="curses__list">
              {cursos.length === 0 ? (
                <p
                  id="no-curses"
                  style={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    marginTop: "2rem",
                  }}
                >
                  Não há cursos disponíveis no momento.
                </p>
              ) : (
                cursos.map((curso) => (
                  <div className="block__curse" key={curso.idCurso}>
                    <div className="title__curse">
                      <div className="tags">
                        <div className="tags__decoration">
                          <p>{curso.linguagem}</p>
                        </div>
                        <div className="tags__decoration">
                          <p>{curso.dificuldade}</p>
                        </div>
                        <div className="tags__decoration">
                          <p>{curso.area}</p>
                        </div>
                      </div>
                      <h1>{curso.nome}</h1>
                    </div>
                    <a
                      href={curso.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btnSaibaMais"
                    >
                      Saiba mais
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
