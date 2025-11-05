import React from 'react';

/**
 * Componente para a página "Sobre a Praxis Capital".
 * Exibe informações institucionais sobre a missão, visão e valores da empresa.
 */
function Sobre({ userId }) {
  // userId é passado, mas não é usado diretamente nesta página estática.

  return (
    <>
      {/* -------------------- Cabeçalho da Página -------------------- */}
      <header id="header">
        <h1 className="logo">
          <strong>Sobre a Praxis Capital</strong>: Nossa Missão
        </h1>
        <p>
          Investimento com conhecimento, análise, parceria e confiança.
        </p>
      </header>
      
      {/* -------------------- Conteúdo Principal -------------------- */}
      <section>
        <header className="major">
          <h2>Missão e Visão</h2>
        </header>
        <div className="content">
          <p>
            Na Praxis Capital, acreditamos que a conexão entre as pessoas é a estratégia mais valiosa no mercado financeiro. Nossa visão é transformar o mundo dos investimentos, fornecendo análises claras, estratégias sólidas, um ambiente de aprendizado colaborativo e um espaço para conhecer novas pessoas e oportunidades. Queremos transformar investidores passivos em protagonistas ativos e conscientes de suas decisões financeiras.
          </p>
          <p>
            Nossa Missão é ser uma plataforma ativa de inteligência, networking e mentoria financeira, reconhecida pela precisão de nossas análises e pelo sucesso de nossa comunidade de usuários.
          </p>
        </div>
      </section>

      {/* -------------------- Nossos Valores -------------------- */}
      <section>
        <header className="major">
          <h2>Nossos Pilares</h2>
        </header>
        <div className="features">
          <article>
            <span className="icon solid fa-lightbulb"></span>
            <div className="content">
              <h3>Educação Contínua</h3>
              <p>Investimos constantemente em materiais atualizados para garantir que nossa comunidade esteja sempre à frente.</p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-shield-alt"></span>
            <div className="content">
              <h3>Transparência</h3>
              <p>Clareza em nossas análises e nas nossas relações com os usuários. Sem letras miúdas.</p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-chart-line"></span>
            <div className="content">
              <h3>Análise de Dados</h3>
              <p>Nossas estratégias são fundamentadas em dados concretos e inteligência de mercado avançada.</p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-users"></span>
            <div className="content">
              <h3>Comunidade</h3>
              <p>Promovemos um ambiente de apoio onde todos aprendem e crescem juntos.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

export default Sobre;