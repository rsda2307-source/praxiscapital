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
        // Mais antigos primeiro para manter a ordem da discussão
        const commentsQuery = query(commentsColRef, orderBy('createdAt', 'asc')); 

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

    }, [db, postId]);

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
    if (loading) return <p className="loading-message">Carregando discussão...</p>;
    if (error) return <p className="error-message" style={{ color: 'red' }}>{error}</p>;
    if (!thread) return <p>Tópico não encontrado.</p>;

    // Helper para formatar data
    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR');
    };

    // Renderização principal
    return (
        <section>
            {/* --- O Tópico Original --- */}
            <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' }}>
                <header className="major" style={{ borderBottom: 'none', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2.5em', margin: 0 }}>{thread.title}</h1>
                </header>
                
                {/* Meta Dados do Post */}
                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem', color: '#777', fontSize: '0.9em' }}>
                    <i className="icon solid fa-user"></i> Postado por: <strong>{thread.authorUsername}</strong>
                    {' '} | {' '}
                    <i className="icon solid fa-calendar"></i> Em: {formatDate(thread.createdAt)}
                </div>
                
                {/* Imagem (se houver) */}
                {thread.imageUrl && (
                    <span className="image main" style={{ marginBottom: '2.5rem' }}>
                        <img src={thread.imageUrl} alt={thread.title} style={{ borderRadius: '6px' }} />
                    </span>
                )}
                
                {/* O Texto principal do tópico */}
                <div className="post-content" style={{ fontSize: '1.1em', lineHeight: 1.7, color: '#333' }}>
                    {/* Usamos whiteSpace 'pre-wrap' para respeitar quebras de linha do textarea */}
                    <p style={{ whiteSpace: 'pre-wrap' }}>{thread.mainComment}</p>
                </div>
            </div>

            <hr style={{ margin: '4rem 0' }} />

            {/* --- Seção de Comentários --- */}
            <div className="comments-section">
                <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid #f7a73f', display: 'inline-block', paddingBottom: '0.5rem' }}>
                    <i className="icon solid fa-reply"></i> Respostas ({comments.length})
                </h2>

                {/* Lista de Comentários */}
                {comments.length === 0 && <p style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>Nenhum comentário ainda. Seja o primeiro a participar da discussão!</p>}

                <div className="comment-list" style={{ display: 'grid', gap: '1.5rem' }}>
                    {comments.map(comment => (
                        <div 
                            key={comment.id} 
                            style={{ 
                                borderLeft: '3px solid #f7a73f', 
                                backgroundColor: '#fff', 
                                borderRadius: '6px', 
                                padding: '1.5rem', 
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)' 
                            }}
                        >
                            {/* Respeita quebras de linha no comentário */}
                            <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 1rem 0', fontSize: '1em', color: '#444' }}>{comment.text}</p>
                            <small style={{ color: '#888', display: 'block', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                                <i className="icon solid fa-user-circle"></i> Por: <strong>{comment.authorUsername}</strong> 
                                {comment.createdAt && ` - ${formatDate(comment.createdAt)}`}
                            </small>
                        </div>
                    ))}
                </div>

                {/* Formulário de Novo Comentário */}
                <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                    <h4><i className="icon solid fa-plus-circle"></i> Adicionar Comentário</h4>
                    {!currentUserProfile && isAuthReady && (
                        <p style={{color: '#c0392b', padding: '0.5rem', border: '1px solid #c0392b', borderRadius: '4px'}}>
                            Você precisa <Link to="/cadastro" style={{color: '#c0392b', fontWeight: 'bold'}}>cadastrar seu perfil</Link> para poder comentar.
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
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={`Comentando como ${currentUserProfile.username}...`}
                                ></textarea>
                            </div>
                            {formError && <p style={{ color: 'red' }}>{formError}</p>}
                            <ul className="actions">
                                <li><button type="submit" className="button primary">Postar Resposta</button></li>
                            </ul>
                        </form>
                    )}
                </div>
            </div>

        </section>
    );
}

export default ForumPostPage;