import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Redirector() {
    const location = useLocation();

    useEffect(() => {
        // Pega a URL completa da query string (ex: ?to=https://...)
        const params = new URLSearchParams(location.search);
        const externalUrl = params.get('to');

        if (externalUrl && externalUrl !== '#') {
            // Se o link é válido, abre a nova aba.
            window.open(externalUrl, '_blank', 'noopener,noreferrer');
        } else {
            console.error("URL de redirecionamento externa inválida ou ausente.");
        }
        
        // Sempre volta para a página anterior (Home ou News) após tentar o redirecionamento
        // Isso impede que a página fique vazia ou com o conteúdo "Redirecionando..."
        window.history.back(); 

    }, [location]); 

    // O Redirector não renderiza conteúdo permanente. Ele só faz a ação de redirecionar.
    return (
        <section>
            <header className="major">
                <h1>Redirecionando...</h1>
            </header>
            <p>Aguarde, estamos abrindo o link original em uma nova aba.</p>
        </section>
    );
}

export default Redirector;
