import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, doc, getDoc, where } from 'firebase/firestore';

/**
 * Componente da Página de Chat Privado
 */
function ChatPage({ db, auth, userId }) {
    const [users, setUsers] = useState([]); 
    const [currentUserProfile, setCurrentUserProfile] = useState(null); 
    const [selectedUser, setSelectedUser] = useState(null); 
    
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [sendError, setSendError] = useState(null); // <-- NOVO: Estado para erro de envio
    const messagesEndRef = useRef(null); 

    const isAuthReady = db && auth && userId;

    // Efeito 1: Carregar perfil atual e lista de usuários
    useEffect(() => {
        if (!isAuthReady) return;

        // 1. Busca o perfil do usuário logado
        const fetchCurrentUserProfile = async () => {
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentUserProfile(docSnap.data());
            } else {
                console.warn("Usuário não tem perfil cadastrado.");
            }
        };

        // 2. Busca a lista de TODOS os usuários (exceto o próprio)
        const usersColRef = collection(db, 'profiles');
        const usersQuery = query(usersColRef, where("userId", "!=", userId)); 

        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const fetchedUsers = [];
            snapshot.forEach((doc) => {
                fetchedUsers.push({ id: doc.id, ...doc.data() });
            });
            setUsers(fetchedUsers);
            setLoadingUsers(false);
        });

        fetchCurrentUserProfile();
        return () => unsubscribeUsers(); 
    }, [isAuthReady, db, userId]);

    // Efeito 2: Carregar mensagens QUANDO um usuário é selecionado
    useEffect(() => {
        if (!selectedUser) {
            setMessages([]); 
            return;
        }

        const chatRoomId = [userId, selectedUser.userId].sort().join('_');
        const messagesColRef = collection(db, 'private-chats', chatRoomId, 'messages');
        const messagesQuery = query(messagesColRef, orderBy('timestamp', 'asc'));

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = [];
            snapshot.forEach((doc) => {
                fetchedMessages.push({ id: doc.id, ...doc.data() });
            });
            setMessages(fetchedMessages);
        });

        return () => unsubscribeMessages();
    }, [selectedUser, userId, db]);

    // Efeito 3: Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Função para enviar mensagem
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSendError(null); // <-- NOVO: Limpa erros antigos
        
        if (newMessage.trim() === '' || !selectedUser || !currentUserProfile) {
            if (!currentUserProfile) {
                setSendError("Erro: Seu perfil ainda está carregando. Tente novamente em alguns segundos.");
            }
            return;
        }

        const chatRoomId = [userId, selectedUser.userId].sort().join('_');
        const messagesColRef = collection(db, 'private-chats', chatRoomId, 'messages');

        try {
            await addDoc(messagesColRef, {
                text: newMessage,
                senderId: userId,
                senderUsername: currentUserProfile.username, 
                timestamp: serverTimestamp(),
            });
            setNewMessage(''); 
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            // <-- NOVO: Mostra o erro para o usuário
            setSendError(`Falha ao enviar: ${error.message}. Verifique suas Regras de Segurança do Firestore.`); 
        }
    };

    // ... (verificação de perfil
    if (!currentUserProfile && isAuthReady) {
        return (
            <section>
                <header className="major">
                    <h1>Chat Privado</h1>
                </header>
                <p className="text-red-500">
                    Você precisa <a href="/cadastro">cadastrar seu perfil</a> (Nome de Usuário e Perfil Profissional) antes de usar o chat.
                </p>
            </section>
        );
    }

    return (
        <section>
            <header className="major">
                <h1>Chat Privado</h1>
            </header>

            <div style={{ display: 'flex', height: '60vh', border: '1px solid #eee' }}>
                
                {/* Coluna 1: Lista de Usuários */}
                <div style={{ width: '30%', borderRight: '1px solid #eee', overflowY: 'auto' }}>
                    <h3 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid #eee' }}>Usuários</h3>
                    {loadingUsers ? (
                        <p style={{ padding: '1rem' }}>Carregando usuários...</p>
                    ) : (
                        <ul>
                            {users.map(user => (
                                <li 
                                    key={user.userId} 
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setSendError(null); // Limpa erros ao trocar de chat
                                    }}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        backgroundColor: selectedUser?.userId === user.userId ? '#f0f0f0' : 'transparent'
                                    }}
                                >
                                    <strong>{user.username}</strong>
                                    <br />
                                    <small>{user.profile}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Coluna 2: Janela de Chat */}
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                    {!selectedUser ? (
                        <div style={{ flexGrow: 1, display: 'grid', placeItems: 'center', color: '#888' }}>
                            <p>Selecione um usuário à esquerda para iniciar a conversa.</p>
                        </div>
                    ) : (
                        <>
                            {/* Header do Chat */}
                            <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                <strong>Conversando com: {selectedUser.username}</strong>
                            </div>

                            {/* Área de Mensagens */}
                            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
                                {messages.map(msg => {
                                    const isSender = msg.senderId === userId;
                                    return (
                                        <div key={msg.id} style={{
                                            textAlign: isSender ? 'right' : 'left',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                backgroundColor: isSender ? '#007bff' : '#eee',
                                                color: isSender ? 'white' : 'black',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '1.25rem',
                                                display: 'inline-block',
                                                maxWidth: '70%'
                                            }}>
                                                {!isSender && <strong style={{ display: 'block', fontSize: '0.8em', marginBottom: '0.2rem' }}>{msg.senderUsername}</strong>}
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de Mensagem */}
                            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
                                <div style={{ display: 'flex' }}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Digite sua mensagem..."
                                        style={{ flexGrow: 1, marginRight: '1rem' }}
                                    />
                                    <button type="submit" className="button primary">Enviar</button>
                                </div>
                                {/* <-- NOVO: Exibição de Erro --> */}
                                {sendError && (
                                    <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9em' }}>
                                        {sendError}
                                    </p>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ChatPage;