import React from 'react';
import { Link } from 'react-router-dom'; // <-- ESSA IMPORTAÇÃO ESTAVA FALTANDO!

/**
 * Componente para a página "Consultoria".
 * Exibe informações sobre os serviços de consultoria personalizados da Praxis Capital.
 */
function Consultoria({ userId }) {
    
  return (
    <>
      {/* -------------------- Cabeçalho da Página -------------------- */}
      <header id="header">
        <h1 className="logo">
          <strong>Consultoria Personalizada</strong>: Maximize Seus Resultados
        </h1>
        <p>
          Agende um horário com nossos especialistas para análise de portfólio, planejamento estratégico e sessões de mentoria individual.
        </p>
      </header>
      
      {/* -------------------- Destaque dos Serviços -------------------- */}
      <section>
        <header className="major">
          <h2>Nossos Serviços de Consultoria</h2>
        </header>
        <div className="features">
          
          {/* Serviço 1: Análise de Portfólio */}
          <article>
            <span className="icon solid fa-chart-pie"></span>
            <div className="content">
              <h3>Análise de Portfólio</h3>
              <p>
                Avaliação detalhada dos seus ativos atuais, identificando riscos e oportunidades para rebalanceamento e otimização de rendimento.
              </p>
            </div>
          </article>

          {/* Serviço 2: Mentoria 1:1 */}
          <article>
            <span className="icon solid fa-chalkboard-teacher"></span>
            <div className="content">
              <h3>Mentoria Individual</h3>
              <p>
                Sessões focadas em suas dúvidas e objetivos. Ideal para quem busca dominar uma área específica do mercado (Ex: Opções, Forex, Renda Fixa).
              </p>
            </div>
          </article>
          
          {/* Serviço 3: Planejamento Fiscal */}
          <article>
            <span className="icon solid fa-calculator"></span>
            <div className="content">
              <h3>Planejamento Fiscal e Sucessório</h3>
              <p>
                Estratégias para otimizar a carga tributária dos seus investimentos e planejar a transferência de patrimônio com segurança.
              </p>
            </div>
          </article>

        </div>
      </section>

      {/* -------------------- Chamada para Agendamento -------------------- */}
      <section>
        <header className="major">
          <h2>Pronto para Começar?</h2>
        </header>
        <p>
          Entre em contato conosco e descreva brevemente seu objetivo. Nossa equipe retornará em até 24 horas para agendar sua primeira sessão gratuita.
        </p>
        <ul className="actions">
          {/* Aqui estava o erro, pois o componente Link não estava definido */}
          <li><Link to="/contato" className="button primary icon solid fa-calendar-check">Agendar Consultoria</Link></li>
        </ul>
      </section>
    </>
  );
}

export default Consultoria;