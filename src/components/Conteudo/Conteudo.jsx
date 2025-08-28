import style from './Conteudo.module.css';
import imagem_destaque from '../../assets/Imagens/img-ini.png';
import BusMap from './BusMap';

const Conteudo = () => {
  return (
    <main className={style.Conteudo}>
      <div className={style.container}>
        <div>
          <div className={style.title}>
            <h1>
              conectando pessoas,
              <br />
              movendo cidades.
            </h1>
          </div>

          <p className={style.p}>
            Somos uma startup focada em transformar a forma como as pessoas se
            mobilizam. Nosso objetivo é identificar e remover barreiras que
            dificultam o engajamento — seja em comunidades, projetos sociais ou
            campanhas — criando soluções práticas e inclusivas que tornam a
            participação mais fácil, acessível e impactante.
          </p>
          <button id="rota">Ver rotas</button>
        </div>

        <div className={style.imagem_destaque}>
          <img src={imagem_destaque} alt="Ilustração Mobiliza Vida" />
        </div>
      </div>

      {/* Seção do Mapa de Ônibus */}
      <BusMap />

      <section id="rotas" className="hero" aria-labelledby="planner-title">
        <div className="centro">
          <span className="badge">Novo • Integra SP</span>
          <h1 id="planner-title">Planeje sua rota</h1>
          <div className="fields">
            <div className="field">
              <input placeholder="Origem" defaultValue="Americana, SP" />
              <button className="swap" title="Trocar origem/destino">⇅</button>
            </div>
            <div className="field">
              <input placeholder="Destino" defaultValue="Campinas, SP" />
            </div>
          </div>
          <div className="cta">
            <button className="btn btn-primary">Ver opções</button>
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="grid" aria-label="Atalhos">
        <a className="card" href="../linhaEMTU/linhaEMTU.html">
          <div className="stripe blue"></div>
          <h3>Linhas EMTU</h3>
          <p>Intermunicipais e metropolitanas.</p>
        </a>
        <a className="card" href="../linhaSOU/linhaSOU.html">
          <div className="stripe yellow"></div>
          <h3>Linhas SOU</h3>
          <p>Urbanas locais nas cidades.</p>
        </a>
        <article className="card">
          <div className="stripe teal"></div>
          <h3>Bilhete & Integração</h3>
          <p>Cartões, tarifas e descontos.</p>
        </article>
        <article className="card">
          <div className="stripe green"></div>
          <h3>Status em tempo real</h3>
          <p>Chegadas, lotação e avisos.</p>
        </article>
      </section>
    </main>
  );
};

export { Conteudo };