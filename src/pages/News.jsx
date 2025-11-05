import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { collection, onSnapshot, query } from 'firebase/firestore'; 

/**
 * Componente interno que renderiza um item de artigo na lista completa.
 */
const ArticleItem = ({ title, summary, category, image, originalLink }) => {
    // *** NOVO: Verifica se o link é válido antes de construir o path ***
    const articleLink = originalLink;
    const isValidLink = articleLink && articleLink.length > 5 && articleLink !== '#';
    const redirectPath = isValidLink ? `/redirect?to=${encodeURIComponent(articleLink)}` : '#';

    // Define o elemento de link/botão condicionalmente
    const LinkElement = isValidLink ? Link : 'span';
    const linkProps = isValidLink ? { to: redirectPath } : {};

    return (
        <article>
            {/* 1. IMAGEM: Usa Link se for válido, senão usa <span> */}
            <LinkElement 
                {...linkProps}
                className="image"
            >
                <img src={image || 'assets/images/pic01.jpg'} alt={title} />
            </LinkElement>
            
            <p className="small text-gray-500">{category}</p>
            
            <h3>
                {/* 2. TÍTULO: Usa Link se for válido, senão usa <span> */}
                <LinkElement 
                    {...linkProps}
                >
                    {title || "Sem Título"}
                </LinkElement>
            </h3>
            <p>{summary || "Nenhum resumo fornecido."}</p>
            
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
};


/**
 * Página completa de listagem de Artigos.
 */
function News({ userId, db }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Conexão e Listener do Firestore
    useEffect(() => {
        if (!db) {
            setError("Falha na conexão com o banco de dados.");
            setLoading(false);
            return;
        }
        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const articlesCollectionPath = `/artifacts/${appId}/public/data/articles`;
        
        const articlesQuery = query(
            collection(db, articlesCollectionPath)
        );

        // SUBSCREVE A MUDANÇAS (LISTENER EM TEMPO REAL)
        const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
            const fetchedArticles = [];
            snapshot.forEach((doc) => {
                fetchedArticles.push({ id: doc.id, ...doc.data() });
            });

            // Ordena do mais novo para o mais antigo 
            fetchedArticles.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            setArticles(fetchedArticles);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Erro ao carregar artigos na News:", err);
            setError("Erro ao carregar o acervo de notícias. Verifique a conexão.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);


    return (
        <>
            <header className="major">
                <h1>Notícias e Artigos</h1>
            </header>
            
            {/* Content Section - Acervo de Notícias */}
            <section>
                <header className="major">
                    <h2>Acervo Completo</h2>
                </header>

                {loading && (
                    <div className="p-8 text-center text-lg text-gray-500">
                        Carregando todo o acervo de artigos em tempo real...
                    </div>
                )}
                
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                        {error}
                    </div>
                )}

                {!loading && (
                    <div className="posts">
                        {/* Renderiza todos os artigos reais ou os placeholders */}
                        {articles.map(article => (
                            <ArticleItem 
                                key={article.id}
                                title={article.title || "Sem Título"}
                                summary={article.summary || "Nenhum resumo fornecido."}
                                category={article.category || "Geral"}
                                image={article.image || 'assets/images/pic01.jpg'}
                                // Passando o link original
                                originalLink={article.originalLink || ''} 
                            />
                        ))}
                    </div>
                )}
                
            </section>
        </>
    );
}

export default News;
