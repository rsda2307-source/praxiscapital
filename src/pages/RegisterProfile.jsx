import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // Importe serverTimestamp

// Recebe 'userId' como prop
function RegisterProfile({ db, auth, userId }) {
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [existingProfile, setExistingProfile] = useState(null);

    const isAuthReady = db && auth && userId;

    useEffect(() => {
        if (!isAuthReady) return;

        // 🛑 MUDANÇA: O caminho agora é uma coleção principal 'profiles'
        const docRef = doc(db, 'profiles', userId); 

        const fetchProfile = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setExistingProfile(data);
                    setUsername(data.username || '');
                    setProfile(data.profile || '');
                    setMessage('Seu perfil atual foi carregado. Você pode editá-lo abaixo.');
                }
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            }
        };

        fetchProfile();
    }, [isAuthReady, db, userId]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!isAuthReady) {
            setMessage('Erro: Autenticação não está pronta.');
            setLoading(false);
            return;
        }
        if (!username.trim() || !profile.trim()) {
            setMessage('Erro: Nome de Usuário e Perfil são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            // 🛑 MUDANÇA: Salva na coleção principal 'profiles'
            const docRef = doc(db, 'profiles', userId); 

            const profileData = {
                username: username.trim(),
                profile: profile.trim(),
                lastUpdated: serverTimestamp(), // Usa o timestamp do servidor
                userId: userId, 
            };

            // setDoc (Merge) é mais seguro para atualizações
            await setDoc(docRef, profileData, { merge: true }); 

            setExistingProfile(profileData);
            setMessage('Perfil salvo com sucesso!');

        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            setMessage(`Erro ao salvar perfil: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // O JSX/HTML permanece o mesmo
    return (
        <section>
            <header className="major">
                <h1>{existingProfile ? 'Editar Perfil' : 'Cadastro de Perfil'}</h1>
            </header>

            <p className="text-sm text-gray-500 mb-4">
                <strong>Seu ID de Usuário:</strong> <code className="break-all">{userId || 'Carregando...'}</code>
            </p>

            {!isAuthReady && (
                <p className="text-blue-500">Aguardando inicialização da autenticação...</p>
            )}

            {message && (
                <div className={`p-3 rounded mb-4 ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : message.includes('carregado') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="username">Nome de Usuário *</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="Seu nome de usuário para o fórum/chat"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="profile">Seu Perfil Profissional *</label>
                        <select 
                            name="profile" 
                            id="profile" 
                            value={profile} 
                            onChange={(e) => setProfile(e.target.value)} 
                            required
                        >
                            <option value="">-- Selecione seu Perfil --</option>
                            <option value="Investidor Iniciante">Investidor Iniciante</option>
                            <option value="Investidor Experiente">Investidor Experiente</option>
                            <option value="Consultor Financeiro">Consultor Financeiro</option>
                            <option value="Estudante de Finanças">Estudante de Finanças</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                </div>
                
                <ul className="actions">
                    <li>
                        <button type="submit" className="button primary" disabled={loading || !isAuthReady}>
                            {existingProfile ? (loading ? 'Atualizando...' : 'Atualizar Perfil') : (loading ? 'Salvando...' : 'Cadastrar Perfil')}
                        </button>
                    </li>
                </ul>
                
                <p className="mt-4 text-xs text-gray-600">Este perfil será exibido nas áreas de interação (Chat e Fórum).</p>

            </form>
        </section>
    );
}

export default RegisterProfile;