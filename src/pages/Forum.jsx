import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

/**
 * Página Principal do Fórum: Lista de Tópicos, Pesquisa e Formulário de Criação
 */
function ForumPage({ db, auth, userId }) {
    const [threads, setThreads] = useState([]); // Lista de tópicos
    const [loading, setLoading] = useState(true);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [error, setError] = useState(null);
    
    // Estado do Formulário de Novo Tópico
    const [newTitle, setNewTitle] = useState('');
    const [newMainComment, setNewMainComment] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [formError, setFormError] = useState(null);
    
    // Estado da Pesquisa
    const [searchTerm, setSearchTerm] = useState('');
    
    const isAuthReady = db && auth && userId;
    const navigate = useNavigate();

    // Efeito 1: Carregar o perfil do usuário atual
    useEffect(() => {
        if (!isAuthReady) return;
        
        const fetchUserProfile = async () => {
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentUserProfile(docSnap.data());
            } else {
                console.warn("Usuário não tem perfil para postar no fórum.");
            }
        };
        fetchUserProfile();
    }, [isAuthReady, db, userId]);

    // Efeito 2: Carregar a lista de tópicos (threads)
    useEffect(() => {
        if (!db) return;

        const threadsColRef = collection(db, 'forum-threads');
        // Ordena por data de criação (mais novos primeiro)
        const threadsQuery = query(threadsColRef, orderBy('createdAt', 'desc')); 

        const unsubscribe = onSnapshot(threadsQuery, (snapshot) => {
            const fetchedThreads = [];
            snapshot.forEach((doc) => {
                fetchedThreads.push({ id: doc.id, ...doc.data() });
            });
            setThreads(fetchedThreads);
            setLoading(false);
        }, (err) => {
            console.error("Erro ao carregar tópicos:", err);
            setError("Não foi possível carregar os tópicos.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    // Filtrar Tópicos Baseado no Termo de Pesquisa (Memoized para performance)
    const filteredThreads = useMemo(() => {
        if (!searchTerm) {
            return threads;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return threads.filter(thread => 
            thread.title.toLowerCase().includes(lowerCaseSearch) ||
            thread.mainComment.toLowerCase().includes(lowerCaseSearch)
        );
    }, [threads, searchTerm]);

    // Função para criar um novo tópico
    const handleCreateThread = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!currentUserProfile) {
            setFormError("Você precisa cadastrar seu perfil para criar um tópico.");
            return;
        }
        if (newTitle.trim() === '' || newMainComment.trim() === '') {
            setFormError("Título e Comentário são obrigatórios.");
            return;
        }

        try {
            const threadsColRef = collection(db, 'forum-threads');
            const docRef = await addDoc(threadsColRef, {
                title: newTitle,
                mainComment: newMainComment,
                imageUrl: newImageUrl || null,
                
                authorId: userId,
                authorUsername: currentUserProfile.username,
                
                createdAt: serverTimestamp(),
            });

            // Limpa o formulário
            setNewTitle('');
            setNewMainComment('');
            setNewImageUrl('');
            
            // Navega para a página do novo post
            navigate(`/forum/${docRef.id}`);

        } catch (error) {
            console.error("Erro ao criar tópico:", error);
            setFormError(`Erro: ${error.message}`);
        }
    };

    return (
        <section>
            <header className="major" style={{ borderBottom: 'none' }}>
                <h1 style={{ marginBottom: '1rem' }}>Fórum de Discussão <i className="icon solid fa-comments" style={{ color: '#F7A73F' }}></i></h1>
            </header>

            {/* --- Formulário de Novo Tópico (Estilizado como Card) --- */}
            <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '3rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <h3>Iniciar um Novo Debate</h3>
                
                {!currentUserProfile && isAuthReady && (
                    <p style={{color: '#c0392b', padding: '0.5rem', border: '1px solid #c0392b', borderRadius: '4px'}}>
                        <i className="icon solid fa-exclamation-triangle"></i> Você precisa <Link to="/cadastro" style={{color: '#c0392b', fontWeight: 'bold'}}>cadastrar seu perfil</Link> para poder criar tópicos.
                    </p>
                )}
                
                {currentUserProfile && (
                    <form onSubmit={handleCreateThread}>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor="threadTitle">Título do Tópico *</label>
                                <input 
                                    type="text" 
                                    id="threadTitle" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Qual é a sua dúvida ou assunto?"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="threadComment">Seu Comentário (Post Principal) *</label>
                                <textarea 
                                    id="threadComment" 
                                    rows="4" 
                                    value={newMainComment}
                                    onChange={(e) => setNewMainComment(e.target.value)}
                                    placeholder="Descreva sua postagem inicial..."
                                ></textarea>
                            </div>
                            <div className="field">
                                <label htmlFor="threadImage">URL da Imagem (Opcional)</label>
                                <input 
                                    type="url" 
                                    id="threadImage" 
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="https://exemplo.com/imagem.png"
                                />
                            </div>
                        </div>
                        {formError && <p style={{ color: 'red' }}>{formError}</p>}
                        <ul className="actions">
                            <li><button type="submit" className="button primary">Criar Tópico</button></li>
                        </ul>
                    </form>
                )}
            </div>

            {/* --- Barra de Pesquisa --- */}
            <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="forum-search" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                    <i className="icon solid fa-search"></i> Pesquisar Tópicos
                </label>
                <input
                    type="text"
                    id="forum-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite o título ou palavra-chave para filtrar..."
                />
            </div>
            
            {/* --- Lista de Tópicos Existentes --- */}
            <div style={{ marginTop: '1rem' }}>
                <h3>{searchTerm ? `Resultados da Pesquisa (${filteredThreads.length})` : 'Tópicos Mais Recentes'}</h3>
                
                {loading && <p>Carregando tópicos...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {filteredThreads.length === 0 && !loading && <p>Nenhum tópico encontrado com o termo: <strong>{searchTerm}</strong></p>}
                
                <div className="posts-list" style={{ display: 'grid', gap: '1rem' }}>
                    {filteredThreads.map(thread => (
                        <article 
                            key={thread.id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                borderRadius: '8px', 
                                padding: '1.5rem', 
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                backgroundColor: '#fff'
                            }}
                            onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.1)';}}
                            onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}
                        >
                            <header>
                                <h4 style={{ margin: 0, fontSize: '1.5em', color: '#444' }}>
                                    <Link to={`/forum/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {thread.title}
                                    </Link>
                                </h4>
                                <small style={{ color: '#888', display: 'block', marginTop: '0.25rem' }}>
                                    <i className="icon solid fa-user-circle"></i> Por: <strong>{thread.authorUsername || 'Anônimo'}</strong> 
                                    {' '} | {' '}
                                    <i className="icon solid fa-clock"></i> Em {thread.createdAt ? new Date(thread.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : ''}
                                </small>
                            </header>
                            
                            <p style={{ margin: '1rem 0 0 0', color: '#555' }}>
                                {thread.mainComment.substring(0, 150)}{thread.mainComment.length > 150 ? '...' : ''}
                            </p>
                            
                            <ul className="actions" style={{ marginTop: '1rem' }}>
                                <li>
                                    <Link to={`/forum/${thread.id}`} className="button small primary">
                                        Ver Discussão <i className="icon solid fa-arrow-right"></i>
                                    </Link>
                                </li>
                            </ul>
                        </article>
                    ))}
                </div>
            </div>

        </section>
    );
}

export default ForumPage;