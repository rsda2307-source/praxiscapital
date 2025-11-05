import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, limit } from 'firebase/firestore'; 

// -------------------------------------------------------------
// Componente ArticlePreview
// -------------------------------------------------------------
const ArticlePreview = ({ db }) => { 
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false); 
            return;
        }
        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const articlesCollectionPath = `/artifacts/${appId}/public/data/articles`;
        
        const articlesQuery = query(
            collection(db, articlesCollectionPath),
            limit(3) 
        );

        const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
            const fetchedArticles = [];
            snapshot.forEach((doc) => {
                fetchedArticles.push({ id: doc.id, ...doc.data() });
            });

            fetchedArticles.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            setArticles(fetchedArticles);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar artigos na Home:", error);
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, [db]);
    
    if (loading) {
        return <p className="text-center text-lg text-gray-500">Carregando últimas notícias...</p>;
    }

    if (articles.length === 0) {
        return <p className="text-center text-gray-500">Nenhum artigo publicado ainda.</p>;
    }

    return (
        <section>
            <header className="major">
                <h2>Notícias e Análises Recentes</h2>
            </header>
            <div className="posts">
                {articles.map(article => {
                    // *** NOVO: Verifica se o link é válido antes de construir o path ***
                    const articleLink = article.originalLink;
                    const isValidLink = articleLink && articleLink.length > 5 && articleLink !== '#';
                    const redirectPath = isValidLink ? `/redirect?to=${encodeURIComponent(articleLink)}` : '#';

                    // Define o elemento de link/botão condicionalmente
                    const LinkElement = isValidLink ? Link : 'span';
                    const linkProps = isValidLink ? { to: redirectPath } : {};
                    
                    return (
                        <article key={article.id}>
                            {/* 1. IMAGEM: Usa Link se for válido, senão usa <span> */}
                            <LinkElement 
                                {...linkProps}
                                className="image"
                            > 
                                <img src={article.image || 'assets/images/pic01.jpg'} alt={article.title} />
                            </LinkElement>
                            
                            <h3>
                                {/* 2. TÍTULO: Usa Link se for válido, senão usa <span> */}
                                <LinkElement 
                                    {...linkProps}
                                >
                                    {article.title || "Sem Título"}
                                </LinkElement>
                            </h3>
                            <p>{article.summary || "Nenhum resumo fornecido."}</p>
                            <ul className="actions">
                                {/* 3. BOTÃO "LEIA": Usa Link se for válido, senão usa <span> */}
                                <li>
                                    {isValidLink ? (
                                        <Link 
                                            to={redirectPath}
                                            className="button"
                                        >
                                            Leia o Artigo Completo
                                        </Link>
                                    ) : (
                                        <span className="button disabled">Link Ausente</span>
                                    )}
                                </li>
                            </ul>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

// -------------------------------------------------------------
// Função Principal Home (mantida inalterada)
// -------------------------------------------------------------
function Home({ userId, db }) {
    return (
        <>
            {/* Banner Section */}
            <section id="banner">
                <div className="content">
                    <header>
                        <h1>Praxis Capital<br />
                        Assessoria e Estratégia</h1>
                        <p>Acelerando seu crescimento no mercado financeiro.</p>
                    </header>
                    <p>Foque no que realmente importa: resultados. Deixe a análise complexa e a estratégia de mercado conosco. Oferecemos soluções personalizadas em gestão de patrimônio, análise de riscos e planejamento financeiro para você e sua empresa.</p>
                    <ul className="actions">
                        <li><Link to="/consultoria" className="button big">Saiba Mais</Link></li>
                    </ul>
                </div>
                <span className="image object">
                    <img src="images/1718965016362.png" alt="" />
                </span>
            </section>

            {/* Section: Diferenciais */}
            <section>
                <header className="major">
                    <h2>Nossos Diferenciais</h2>
                </header>
                <div className="features">
                    <article>
                        <span className="icon solid fa-handshake"></span>
                        <div className="content">
                            <h3>Networking de Elite</h3>
                            <p>Conexão direta com empresários, investidores, CEOs e mentores de sucesso para alavancar sua jornada.</p>
                        </div>
                    </article>
                    <article>
                        <span className="icon solid fa-graduation-cap"></span>
                        <div className="content">
                            <h3>Treinamento Prático</h3>
                            <p>Programas focados em gestão, finanças e liderança, com aplicação imediata no seu negócio.</p>
                        </div>
                    </article>
                    <article>
                        <span className="icon solid fa-chart-line"></span>
                        <div className="content">
                            <h3>Acesso a Capital</h3>
                            <p>Oportunidades de captação de recursos e parcerias estratégicas para expansão.</p>
                        </div>
                    </article>
                </div>
            </section>

            {/* Renderiza Artigos SOMENTE se 'db' estiver pronto. */}
            {db && <ArticlePreview db={db} />} 
        </>
    );
}

export default Home;
