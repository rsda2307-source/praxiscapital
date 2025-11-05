import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// IMPORTA A FUNÇÃO QUE INICIALIZA O MENU EXPANSÍVEL DO TEMPLATE
import { initTemplateScripts } from '../initTemplate.js'; 

function Sidebar() {
    
    // O useEffect garante que a função de inicialização do template
    // (que faz o menu 'Institucional' funcionar) seja chamada APÓS o React
    // renderizar o componente.
    useEffect(() => {
        initTemplateScripts(); 

        return () => {
            // Cleanup (futuro)
        };
    }, []); // Array vazio garante que ele rode apenas uma vez

    return (
        <div id="sidebar">
            <div className="inner">
                {/* Menu Principal */}
                <nav id="menu">
                    <header className="major">
                        <h2>Menu Principal</h2>
                    </header>
                    <ul>
                        {/* Páginas Principais */}
                        <li><Link to="/">Home</Link></li> 
                        <li><Link to="/news">Notícias & Artigos</Link></li> 
                        <li><Link to="/cursos">Cursos e Materiais</Link></li> 
                        <li><Link to="/forum">Fórum de Discussão</Link></li>
                        <li><Link to="/chat">Chat Privado</Link></li> 
                        
                        {/* Menu Expansível: Institucional */}
                        <li>
                            <span className="opener">Institucional</span>
                            <ul>
                                <li><Link to="/sobre">Sobre a Praxis Capital</Link></li>
                                <li><Link to="/consultoria">Consultoria</Link></li>
                                <li><Link to="/contato">Contato</Link></li>
                            </ul>
                        </li>
                        
                        {/* 
                          *
                          * ALTERAÇÃO FEITA AQUI 
                          *
                        */}
                        {/* Páginas de Usuário/Conta */}
                        <li><Link to="/cadastro">Cadastro / Perfil</Link></li> {/* <-- ADICIONADO: Link para a nova página */}
                    </ul>
                </nav>

                {/* Mini Posts Section */}
                <section>
                    <header className="major">
                        <h2>Em Destaque</h2>
                    </header>
                    <div className="mini-posts">
                        <article>
                            <Link to="/news" className="image"><img src="images/bc.png" alt="Análise de mercado" /></Link>
                            <p>Análise de mercado: O que esperar do índice no próximo trimestre.</p>
                        </article>
                    </div>
                    <ul className="actions">
                        <li><Link to="/news" className="button">Mais Notícias</Link></li>
                    </ul>
                </section>

                {/* Contact Section */}
                <section>
                    <header className="major">
                        <h2>Entre em Contato</h2>
                    </header>
                    <p>Fale Conosco</p>
                    <ul className="contact">
                        <li className="icon solid fa-envelope"><a href="mailto:rsda2307@gmail.com">rsda2307@gmail.com</a></li>
                        <li className="icon solid fa-phone">(11) 91924-3190</li>
                    </ul>
                </section>

                {/* Footer */}
                <footer id="footer">
                    <p className="copyright">&copy; 2025 Praxis Capital. Todos Direitos Reservados.</p>
                </footer>

            </div>
        </div>
    );
}

export default Sidebar;