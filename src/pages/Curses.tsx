import Layout from "../components/Layout";
import "../assets/css/curses.css";

function Curses() {
  return (
    <Layout>
      <section>
        <article>
          <div className="filters">
            <div>
              <div>
                <h2>DIFICULDADE</h2>
                <div>
                  <div className="option">
                    <input
                      type="radio"
                      name="dificuldade"
                      id="todas-dificuldade"
                    />
                    <label htmlFor="todas-dificuldade">Todas</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="dificuldade" id="iniciante" />
                    <label htmlFor="iniciante">Iniciante</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="dificuldade" id="intermediario" />
                    <label htmlFor="intermediario">Intermediário</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="dificuldade" id="avancado" />
                    <label htmlFor="avancado">Avançado</label>
                  </div>
                </div>
              </div>

              <div className="filter">
                <h2>ÁREA</h2>
                <div>
                  <div className="option">
                    <input type="radio" name="area" id="todas-area" />
                    <label htmlFor="todas-area">Todas</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="area" id="programacao" />
                    <label htmlFor="programacao">Programação</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="area" id="web" />
                    <label htmlFor="web">Desenvolvimento Web</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="area" id="banco" />
                    <label htmlFor="banco">Banco de Dados</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="area" id="hardware" />
                    <label htmlFor="hardware">Hardware</label>
                  </div>
                </div>
              </div>

              <div className="filter">
                <h2>LINGUAGEM</h2>
                <div>
                  <div className="option">
                    <input type="radio" name="linguagem" id="todas-linguagem" />
                    <label htmlFor="todas-linguagem">Todas</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="linguagem" id="python" />
                    <label htmlFor="python">Python</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="linguagem" id="javascript" />
                    <label htmlFor="javascript">JavaScript Web</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="linguagem" id="java" />
                    <label htmlFor="java">Java</label>
                  </div>
                  <div className="option">
                    <input type="radio" name="linguagem" id="htmlcss" />
                    <label htmlFor="htmlcss">HTML / CSS</label>
                  </div>
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
              />
            </div>

            <div className="curses__list">
              {Array.from({ length: 24 }).map((_, idx) => (
                <div className="block__curse" key={idx}>
                  <div className="title__curse">
                    <div className="tags">
                      <div className="tags__decoration">
                        <p>Linguagem</p>
                      </div>
                      <div className="tags__decoration">
                        <p>Dificuldade</p>
                      </div>
                      <div className="tags__decoration">
                        <p>Área</p>
                      </div>
                    </div>
                    <h1>NOME DO CURSO {idx + 1}</h1>
                  </div>
                  <button className="btn btnSaibaMais">Saiba mais</button>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export default Curses;
