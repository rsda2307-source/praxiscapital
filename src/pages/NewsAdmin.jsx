import React from 'react';
import ArticleForm from '../components/ArticleForm';

/**
 * Página de Administração para cadastrar novos artigos.
 * Acesso agora está LIBERADO para fins de demonstração.
 */
function NewsAdmin({ userId, db }) {
    
    // A remoção da lógica de verificação de isAdmin libera o acesso.
    // O formulário ArticleForm precisa do userId e db para salvar o post.

    if (!db) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
                Erro: O banco de dados não está conectado.
            </div>
        );
    }
    
    return (
        <>
            <header className="major">
                <h1>Painel de Administração de Notícias</h1>
                <p>Crie e publique novos artigos no acervo da Praxis Capital.</p>
            </header>
            
            <ArticleForm userId={userId} db={db} />
        </>
    );
}

export default NewsAdmin;