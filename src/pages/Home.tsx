import Layout from "../components/Layout";
import ComputerAndCoffe from "../assets/images/laptop_coffe.png";
import PCConding from "../assets/images/pc_coding.png";
import Coding_icon from "../assets/logos/coding_icon.jpg";
import Objective_icon from "../assets/logos/objective_icon.jpg";
import "../assets/css/home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section id="first__background">
        <article>
          <div className="content">
            <div className="content__left">
              <div className="hero-texts">
                <h1>
                  QUEM APRENDE A PENSAR, APRENDE A{" "}
                  <span>CONSTRUIR QUALQUER FUTURO</span>.
                </h1>
                <p>
                  Aprenda programação do zero com cursos práticos, linguagem
                  acessível e uma abordagem que prioriza o raciocínio lógico e a
                  criação de soluções reais.
                </p>
                <div id="btn_start">
                  <button className="btn" onClick={() => navigate("/curses")}>
                    COMECE AGORA
                  </button>
                </div>
              </div>
            </div>
            <div className="content__right">
              <img id="ComputerAndCoffe" src={ComputerAndCoffe} alt="" />
            </div>
          </div>
        </article>
      </section>
      <section id="second__background">
        <article>
          <div className="content__left">
            <img id="PCConding" src={PCConding} alt="" />
          </div>
          <div id="quemsomos" className="content__right">
            <div id="title">
              <h1 className="highlighted-title">
                O QUE É O<br />
                KALIO PROJECT?
              </h1>
            </div>
            <div>
              <div className="quemsomos__blocks">
                <div className="quemsomos__titles">
                  <img className="quemsomos__icons" src={Coding_icon} alt="" />
                  <h2>O que é</h2>
                </div>
                <p>
                  É um projeto educacional voltado à democratização do
                  conhecimento computacional. Nosso objetivo é tornar o
                  aprendizado em programação, lógica e desenvolvimento digital
                  acessível a todos, com preços extremamente reduzidos,
                  linguagem clara e conteúdos de qualidade.
                </p>
              </div>
              <div className="quemsomos__blocks">
                <div className="quemsomos__titles">
                  <img
                    className="quemsomos__icons"
                    src={Objective_icon}
                    alt=""
                  />
                  <h2>Objetivo</h2>
                </div>
                <p>
                  Buscamos alcançar mil alunos e gerar visibilidade em
                  instituições de ensino, mostrando que é possível formar
                  talentos com acessibilidade e qualidade, aproximando o ensino
                  independente do meio acadêmico.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}
