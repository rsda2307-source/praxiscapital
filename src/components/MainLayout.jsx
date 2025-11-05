import React from 'react';
import Sidebar from './Sidebar';

// Largura da Sidebar conforme o CSS original do template
const SIDEBAR_WIDTH = '26em'; 

function MainLayout({ children }) {
    return (
        // CONTÊINER PAI: Usa Grid Layout para definir as colunas
        <div 
            className="min-h-screen" 
            style={{ 
                display: 'grid',
                // Define as colunas: 26em para o Sidebar, 1 fração (o resto) para o Conteúdo
                gridTemplateColumns: `${SIDEBAR_WIDTH} 1fr`,
                // Garante que o conteúdo e a sidebar tenham altura total
                minHeight: '100vh' 
            }}
        > 
            
            {/* 1. Sidebar (Menu Lateral) - Coluna 1 do Grid */}
            {/* Removemos o 'fixed' e o 'left-0' porque o Grid cuida do posicionamento */}
            <aside id="sidebar-wrapper" 
                   className="hidden md:block bg-gray-100 border-r z-10">
                <div className="inner"> 
                   <Sidebar />
                </div>
            </aside>

            {/* 2. Conteúdo Principal - Coluna 2 do Grid */}
            {/* Removemos todas as classes de margem e width: calc() */}
            <main id="content-wrapper" 
                  className="w-full"> 
                 
                {/* ⚠️ ESTRUTURA VITAL para o script de navegação (IDs) ⚠️ */}
                <div id="wrapper" className="w-full"> 
                    <div id="main"> 
                        <div className="inner p-8"> 
                            {children} 
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default MainLayout;