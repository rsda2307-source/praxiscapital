// Este código foi adaptado da lógica do template Editorial (main.js)
// e é responsável por fazer o menu expansível (.opener) e o toggle mobile funcionarem.

export function initTemplateScripts() {
    const $ = (el) => document.querySelector(el);
    const $$ = (el) => document.querySelectorAll(el);

    const $sidebar = $('#sidebar');

    // --- Lógica para o Menu Expansível (EXPANDERS) -- -
    const setupMenuExpanders = () => {
        const openers = $$('#menu .opener');
        
        openers.forEach(opener => {
            // Garante que o evento seja adicionado apenas uma vez
            if (opener.getAttribute('data-setup') !== 'true') {
                
                opener.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const submenu = opener.nextElementSibling;

                    if (opener.classList.contains('active')) {
                        // Se já estiver ativo (aberto), fecha
                        opener.classList.remove('active');
                        if (submenu && submenu.tagName === 'UL') {
                            submenu.style.display = 'none';
                        }
                    } else {
                        // Se estiver fechado, abre
                        opener.classList.add('active');
                        if (submenu && submenu.tagName === 'UL') {
                            submenu.style.display = 'block';
                        }
                    }
                });

                opener.setAttribute('data-setup', 'true');
            }
        });
        
        // Garante que todos os submenus comecem fechados ao carregar
        $$('#menu ul ul').forEach(ul => {
            // Se o pai tiver a classe 'active' ao carregar, mantenha aberto (opcional)
            if (!ul.previousElementSibling.classList.contains('active')) {
                ul.style.display = 'none';
            }
        });
    };

    // --- Lógica de Toggle do Menu (REMOVIDA) ---
    // A função setupToggle original foi removida daqui, pois era a responsável por criar o ícone.
    // Agora, o script apenas configura a expansão do menu.

    // --- Inicialização -- -
    const initialize = () => {
        if ($sidebar) {
            setupMenuExpanders();
            // A chamada para setupToggle() foi removida daqui
        }
    };
    
    initialize();
}