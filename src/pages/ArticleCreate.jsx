import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function ArticleCreate({ db, auth }) {
    // Campos necessários: title, summary (para preview) e originalLink (para redirecionar)
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        originalLink: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Garante que db e auth existam
    if (!db || !auth || !auth.currentUser) {
        return (
            <section>
                <header className="major">
                    <h1>Criação de Artigos</h1>
                </header>
                <p>Você precisa estar autenticado para criar artigos. Por favor, aguarde o login automático.</p>
            </section>
        );
    }

    // Lógica para atualizar o estado do formulário
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Lógica para salvar no Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validação básica
        if (!formData.title) {
            setMessage('Erro: O Título é obrigatório.');
            setLoading(false);
            return;
        }
        
        if (!formData.originalLink || formData.originalLink.length < 10) {
            setMessage('Erro: O Link Original deve ser uma URL completa e válida (Ex: https://...).');
            setLoading(false);
            return;
        }

        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            // Caminho para a coleção pública de artigos
            const collectionPath = `/artifacts/${appId}/public/data/articles`;
            
            const newArticle = {
                ...formData,
                createdAt: serverTimestamp(),
                authorId: auth.currentUser.uid,
                originalLink: formData.originalLink.trim(), 
            };

            await addDoc(collection(db, collectionPath), newArticle);

            setMessage('Artigo publicado com sucesso! Verifique a página Home/Notícias.');
            setFormData({
                title: '',
                summary: '',
                originalLink: '',
            });

        } catch (error) {
            console.error("Erro ao publicar artigo:", error);
            setMessage(`Erro ao publicar artigo: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <header className="major">
                <h1>Publicar Novo Artigo (Redirecionamento)</h1>
            </header>

            {message && (
                <div className={`p-3 rounded mb-4 ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                
                {/* 1. CAMPO TÍTULO: Único dentro do primeiro bloco fields */}
                <div className="fields">
                    <div className="field">
                        <label htmlFor="title">Título do Artigo *</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
                    </div>
                </div>

                {/* 2. CAMPO LINK ORIGINAL: ISOLADO Fora do fields para evitar conflitos de layout. */}
                <div className="field">
                    <label htmlFor="originalLink">Link Original (URL Completa) *</label>
                    <input 
                        type="url" 
                        name="originalLink" 
                        id="originalLink" 
                        value={formData.originalLink} 
                        onChange={handleChange} 
                        required 
                        placeholder="https://www.infomoney.com.br/seu-artigo" 
                    />
                </div>
                {/* FIM DO CAMPO ISOLADO */}

                {/* 3. CAMPO RESUMO CURTO: De volta ao fields, mas sozinho (o que o template aceita) */}
                <div className="fields">
                    <div className="field">
                        <label htmlFor="summary">Resumo Curto / Descrição do Card</label>
                        <textarea name="summary" id="summary" rows="2" value={formData.summary} onChange={handleChange}></textarea>
                    </div>
                </div>
                
                <ul className="actions">
                    <li>
                        <button type="submit" className="button primary" disabled={loading}>
                            {loading ? 'Publicando...' : 'Publicar Artigo'}
                        </button>
                    </li>
                </ul>
            </form>
        </section>
    );
}

export default ArticleCreate;
