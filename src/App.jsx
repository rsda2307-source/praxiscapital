import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// Componentes de Layout
import MainLayout from './components/Mainlayout'; 

// Páginas
import Home from './pages/Home';
import News from './pages/News'; 
import Consultoria from './pages/Consultoria';
import Contato from './pages/Contato';
import Cursos from './pages/Cursos';
import Forum from './pages/Forum'; // <-- Rota principal do Fórum
import Sobre from './pages/Sobre';
import NewsAdmin from './pages/NewsAdmin';
import Redirector from './pages/Redirector';
import RegisterProfile from './pages/RegisterProfile'; 
import ChatPage from './pages/ChatPage';
import ForumPostPage from './pages/ForumPostPage'; // <-- Rota de detalhes do Fórum

function App() {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        // ----------------------------------------------------------------------
        // CONFIGURAÇÃO CORRETA DO FIREBASE
        // ----------------------------------------------------------------------
        const firebaseConfig = {
            apiKey: "AIzaSyAOM2DZtGiJ88eDzI_IoInx4YLzxD6kE0k",
            authDomain: "praxiscapital-3cfdb.firebaseapp.com",
            projectId: "praxiscapital-3cfdb",
            storageBucket: "praxiscapital-3cfdb.firebasestorage.app", 
            messagingSenderId: "39603192567",
            appId: "1:39603192567:web:0962b3ed01aa93898309f2",
            measurementId: "G-7H40NTJB7W"
        };
        // ----------------------------------------------------------------------

        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            
            setLogLevel('debug');
            setDb(firestoreDb); 
            setAuth(firebaseAuth);

            // Listener de Autenticação (Login Anônimo)
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    console.log("Firebase Auth: Usuário conectado com UID:", user.uid);
                    setUserId(user.uid);
                    setIsAuthReady(true);
                } else {
                    signInAnonymously(firebaseAuth)
                        .catch(err => {
                            console.error("ERRO CRÍTICO ao autenticar anonimamente:", err);
                        })
                        .finally(() => setIsAuthReady(true)); 
                }
            });

            return () => unsubscribe();

        } catch (initError) {
            console.error("Erro fatal na inicialização do Firebase:", initError);
            setIsAuthReady(true); 
        }
    }, []); 

    // Tela de Carregamento Padrão
    if (!isAuthReady || !db) { 
        return (
            <div id="wrapper" className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Carregando Plataforma...</h1>
                    <p className="mt-2 text-gray-500">Conectando aos serviços de autenticação e dados.</p>
                </div>
            </div>
        );
    }
    
    // Renderização das Rotas (Passando o userId)
    return (
        <MainLayout>
            <Routes>
                {/* Rotas Padrão */}
                <Route path="/" element={<Home userId={userId} db={db} />} /> 
                <Route path="/news" element={<News userId={userId} db={db} />} /> 
                <Route path="/consultoria" element={<Consultoria userId={userId} db={db} />} />
                <Route path="/contato" element={<Contato userId={userId} db={db} />} />
                <Route path="/cursos" element={<Cursos userId={userId} db={db} />} /> 
                <Route path="/sobre" element={<Sobre userId={userId} db={db} />} />
                
                {/* Rota de Admin */}
                <Route path="/admin/news" element={<NewsAdmin userId={userId} db={db} />} />
                
                {/* Rota de Redirecionamento */}
                <Route path="/redirect" element={<Redirector />} />
                
                {/* Rotas Sociais (com props) */}
                <Route path="/cadastro" element={<RegisterProfile db={db} auth={auth} userId={userId} />} />
                <Route path="/chat" element={<ChatPage db={db} auth={auth} userId={userId} />} />

                {/* --- ROTA DO FÓRUM CORRIGIDA --- */}
                {/* Adicionando auth={auth} para que o formulário de criação apareça */}
                <Route path="/forum" element={<Forum userId={userId} db={db} auth={auth} />} />
                <Route path="/forum/:postId" element={<ForumPostPage db={db} auth={auth} userId={userId} />} />

            </Routes>
        </MainLayout>
    );
}

export default App;