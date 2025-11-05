import React, { useState, useEffect } from 'react';
// Hook para pegar o ID da URL
import { useParams, Link } from 'react-router-dom'; 
// Funções do Firestore
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    onSnapshot, 
    orderBy, 
    addDoc, 
    serverTimestamp 
} from 'firebase/firestore';

/**
 * Página de Detalhes do Tópico (Thread) e seus Comentários
 */
function ForumPostPage({ db, auth, userId }) {
    // Pega o ID (ex: abc12345) da URL,
    // o nome :postId deve ser o mesmo definido na Rota do App.jsx
    const { postId } = useParams(); 
    
    const [thread, setThread] = useState(null); // O tópico principal
    const [comments, setComments] = useState([]); // A lista de comentários
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    
    // Estado do Formulário de Novo Comentário
    const [newComment, setNewComment] = useState('');
    const [formError, setFormError] = useState(null);

    const isAuthReady = db && auth && userId;

    // Efeito 1: Carregar o perfil do usuário atual (para saber quem está comentando)
    useEffect(() => {
        if (!isAuthReady) return;
        
        const fetchUserProfile = async () => {
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentUserProfile(docSnap.data());
            } else {
                console.warn("Usuário não cadastrou perfil.");
            }
        };
        fetchUserProfile();
    }, [isAuthReady, db, userId]);

    // Efeito 2: Carregar o Tópico (Thread) principal E os Comentários
    useEffect(() => {
        if (!db || !postId) return;

        setLoading(true);
        setError(null);

        // 1. Carrega o Tópico (Thread)
        const threadDocRef = doc(db, 'forum-threads', postId);
        
        const unsubscribeThread = onSnapshot(threadDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setThread({ id: docSnap.id, ...docSnap.data() });
            } else {
                setError("Tópico não encontrado.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Erro ao carregar tópico:", err);
            setError("Erro ao carregar tópico.");
            setLoading(false);
        });

        // 2. Carrega os Comentários (Sub-coleção)
        const commentsColRef = collection(db, 'forum-threads', postId, 'comments');
        const commentsQuery = query(commentsColRef, orderBy('createdAt', 'asc')); // Mais antigos primeiro

        const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
            const fetchedComments = [];
            snapshot.forEach((doc) => {
                fetchedComments.push({ id: doc.id, ...doc.data() });
            });
            setComments(fetchedComments);
        });

        // Função de limpeza (para o React parar de "ouvir" quando o usuário sair da página)
        return () => {
            unsubscribeThread();
            unsubscribeComments();
        };

    }, [db, postId]); // Re-executa se o ID do post na URL mudar

    // Função para postar um novo comentário
    const handlePostComment = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!currentUserProfile) {
            setFormError("Você precisa cadastrar seu perfil para comentar.");
            return;
        }
        if (newComment.trim() === '') {
            setFormError("O comentário não pode estar vazio.");
            return;
        }

        try {
            // Referência para a sub-coleção de comentários deste post
            const commentsColRef = collection(db, 'forum-threads', postId, 'comments');
            
            await addDoc(commentsColRef, {
                text: newComment,
                authorId: userId,
                authorUsername: currentUserProfile.username, // Pego do perfil salvo
                createdAt: serverTimestamp(),
            });

            setNewComment(''); // Limpa o formulário

        } catch (error) {
            console.error("Erro ao postar comentário:", error);
            setFormError(`Erro ao publicar: ${error.message}`);
        }
    };


    // Renderização condicional
    if (loading) return <p>Carregando discussão...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!thread) return <p>Tópico não encontrado.</p>;

    // Renderização principal
    return (
        <section>
            {/* --- O Tópico Original --- */}
            <header className="major">
                <h1>{thread.title}</h1>
            </header>
            <p style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem', color: '#555' }}>
                Postado por: <strong>{thread.authorUsername}</strong>
                <br />
                Em: {thread.createdAt ? new Date(thread.createdAt.seconds * 1000).toLocaleString() : '...'}
            </p>
            
            {/* Imagem (se houver) */}
            {thread.imageUrl && (
                <span className="image main" style={{ marginBottom: '2rem' }}>
                    <img src={thread.imageUrl} alt={thread.title} />
                </span>
            )}
            
            {/* O Texto principal do tópico */}
            <div className="post-content" style={{ fontSize: '1.1em', lineHeight: 1.6 }}>
                {/* Usamos whiteSpace 'pre-wrap' para respeitar quebras de linha do textarea */}
                <p style={{ whiteSpace: 'pre-wrap' }}>{thread.mainComment}</p>
            </div>

            <hr style={{ margin: '3rem 0' }} />

            {/* --- Seção de Comentários --- */}
            <div className="comments-section">
                <h3>Respostas</h3>

                {/* Lista de Comentários */}
                {comments.length === 0 && <p>Nenhum comentário ainda. Seja o primeiro!</p>}

                {comments.map(comment => (
                    <div key={comment.id} style={{ border: '1px solid #eee', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' }}>
                        {/* Respeita quebras de linha no comentário */}
                        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{comment.text}</p>
                        <small style={{ color: '#555', paddingTop: '0.5rem', display: 'block' }}>
                            Por: <strong>{comment.authorUsername}</strong> 
                            {comment.createdAt && ` - ${new Date(comment.createdAt.seconds * 1000).toLocaleString()}`}
                        </small>
                    </div>
                ))}

                {/* Formulário de Novo Comentário */}
                <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                    <h4>Deixar uma Resposta</h4>
                    {!currentUserProfile && isAuthReady && (
                        <p style={{color: 'red'}}>
                            Você precisa <Link to="/cadastro" style={{color: 'blue'}}>cadastrar seu perfil</Link> para poder comentar.
                        </p>
                    )}

                    {currentUserProfile && (
                        <form onSubmit={handlePostComment}>
                            <div className="field">
                                <label htmlFor="newComment">Seu comentário *</label>
                                <textarea 
                                    id="newComment" 
                                    rows="3" 
                                    value={newComment}
                                    // ESTA É A LINHA CORRIGIDA:
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                            </div>
                            {formError && <p style={{ color: 'red' }}>{formError}</p>}
                            <ul className="actions">
                                <li><button type="submit" className="button primary">Postar Comentário</button></li>
                            </ul>
                        </form>
                    )}
                </div>
            </div>

        </section>
    );
}

export default ForumPostPage;