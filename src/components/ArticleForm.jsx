import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Formulário para adicionar novos artigos à coleção do Firestore.
 * @param {object} props - Propriedades passadas ao componente.
 * @param {object} props.db - Instância do Firestore.
 * @param {string} props.userId - ID do usuário logado (anônimo, neste caso).
 */
function ArticleForm({ db, userId }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('Geral');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!db) {
            setMessage('Erro: Conexão com o banco de dados indisponível.');
            setLoading(false);
            return;
        }
        
        // Caminho da coleção que você está usando no News.jsx
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const articlesCollectionPath = `/artifacts/${appId}/public/data/articles`;

        try {
            // Cria o objeto do novo artigo
            const newArticle = {
                title,
                summary,
                image: image || 'assets/images/pic01.jpg', // Placeholder se a imagem estiver vazia
                category,
                content,
                authorId: userId, // O ID do usuário anônimo
                createdAt: serverTimestamp(), // Carimbo de data/hora do servidor
                link: '#' // Você pode expandir isso para uma rota detalhada depois
            };

            // Adiciona o documento ao Firestore. O ID será gerado automaticamente.
            await addDoc(collection(db, articlesCollectionPath), newArticle);

            setMessage('Artigo cadastrado com sucesso!');
            // Limpa o formulário
            setTitle('');
            setSummary('');
            setImage('');
            setCategory('Geral');
            setContent('');

        } catch (error) {
            console.error("Erro ao adicionar artigo: ", error);
            setMessage(`Falha ao cadastrar artigo: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <header className="major">
                <h2>Cadastrar Novo Artigo / Notícia</h2>
            </header>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="fields">
                    
                    <div className="field half">
                        <label htmlFor="title">Título</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    
                    <div className="field half">
                        <label htmlFor="category">Categoria</label>
                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Geral, Finanças, Investimentos" required />
                    </div>

                    <div className="field">
                        <label htmlFor="summary">Resumo (Max 200 caracteres)</label>
                        <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength="200" required />
                    </div>

                    <div className="field">
                        <label htmlFor="image">Link da Imagem (URL ou caminho local)</label>
                        <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Ex: assets/images/pic01.jpg" />
                    </div>
                    
                    <div className="field">
                        <label htmlFor="content">Conteúdo Completo do Artigo</label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="6" required></textarea>
                    </div>

                </div>
                
                <ul className="actions">
                    <li>
                        <button type="submit" className="button primary" disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Cadastrar Artigo'}
                        </button>
                    </li>
                    <li><button type="reset" className="button" onClick={() => { setTitle(''); setSummary(''); setImage(''); setContent(''); setCategory('Geral'); }}>Limpar</button></li>
                </ul>
            </form>
        </section>
    );
}

export default ArticleForm;