import React from 'react';

function Contato({ userId }) {
  // userId passado pelo App.jsx, mas não usado diretamente aqui.
    
  // NOTA: No React, o formulário deve usar uma função de manipulação de estado (useState) e o onSubmit.
  // Por enquanto, é apenas o HTML.
    
  return (
    <>
      {/* -------------------- Cabeçalho da Página -------------------- */}
      <header id="header">
        <h1 className="logo">
          <strong>Contato</strong>: Fale com a Praxis Capital
        </h1>
        <p>
          Tem perguntas sobre nossos cursos, análises ou oportunidades de parceria? Entre em contato conosco.
        </p>
      </header>
      
      {/* -------------------- Formulário de Contato -------------------- */}
      <section>
        <header className="major">
          <h2>Envie sua Mensagem</h2>
        </header>
        <form method="post" action="#">
          <div className="row gtr-uniform">
            
            {/* Campo Nome */}
            <div className="col-6 col-12-small">
              <input type="text" name="name" id="name" placeholder="Nome Completo" />
            </div>
            
            {/* Campo Email */}
            <div className="col-6 col-12-small">
              <input type="email" name="email" id="email" placeholder="Email" />
            </div>
            
            {/* Campo Assunto */}
            <div className="col-12">
              <input type="text" name="subject" id="subject" placeholder="Assunto" />
            </div>
            
            {/* Campo Mensagem */}
            <div className="col-12">
              <textarea name="message" id="message" placeholder="Escreva sua mensagem" rows="6"></textarea>
            </div>
            
            {/* Botões de Ação */}
            <div className="col-12">
              <ul className="actions">
                {/* O atributo type="submit" fará o refresh se não for tratado pelo React */}
                <li><input type="submit" value="Enviar Mensagem" className="primary" /></li>
                <li><input type="reset" value="Limpar" /></li>
              </ul>
            </div>
          </div>
        </form>
      </section>

      {/* -------------------- Informações de Contato Direto -------------------- */}
      <section>
        <header className="major">
          <h2>Informações Diretas</h2>
        </header>
        <p>Preferir falar conosco por telefone ou email direto? Use os dados abaixo.</p>
        <ul className="contact">
          <li className="icon solid fa-envelope">rsda2307@gmail.com</li>
          <li className="icon solid fa-phone">(11) 91924-3190 (Atendimento de Suporte)</li>
        </ul>
      </section>
    </>
  );
}

export default Contato;