import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

/**
 * Página Principal do Fórum: Lista de Tópicos e Formulário de Criação
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
    
    const isAuthReady = db && auth && userId;
    const navigate = useNavigate(); // Para navegar após criar o post

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
        const threadsQuery = query(threadsColRef, orderBy('createdAt', 'desc')); // Mais novos primeiro

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
                imageUrl: newImageUrl || null, // Salva null se vazio
                
                authorId: userId,
                authorUsername: currentUserProfile.username, // Pego do perfil
                
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
            <header className="major">
                <h1>Fórum de Discussão</h1>
            </header>

            {/* --- Formulário de Novo Tópico --- */}
            <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <h3>Criar Novo Tópico</h3>
                
                {!currentUserProfile && isAuthReady && (
                    <p style={{color: 'red'}}>
                        Você precisa <Link to="/cadastro" style={{color: 'blue'}}>cadastrar seu perfil</Link> para poder criar tópicos.
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

            {/* --- Lista de Tópicos Existentes --- */}
            <div style={{ marginTop: '3rem' }}>
                <h3>Tópicos Abertos</h3>
                {loading && <p>Carregando tópicos...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <div className="posts-list" style={{ listStyle: 'none', padding: 0 }}>
                    {threads.map(thread => (
                        <article key={thread.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                            <h4>
                                {/* O Link para a página de detalhes */}
                                <Link to={`/forum/${thread.id}`}>
                                    {thread.title}
                                </Link>
                            </h4>
                            <small>
                                Postado por: <strong>{thread.authorUsername || 'Anônimo'}</strong> 
                                em {thread.createdAt ? new Date(thread.createdAt.seconds * 1000).toLocaleDateString() : ''}
                            </small>
                            <p style={{ margin: '0.5rem 0 0 0' }}>
                                {thread.mainComment.substring(0, 150)}...
                            </p>
                            <ul className="actions" style={{ marginTop: '1rem' }}>
                                <li>
                                    <Link to={`/forum/${thread.id}`} className="button small">
                                        Ver Discussão
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