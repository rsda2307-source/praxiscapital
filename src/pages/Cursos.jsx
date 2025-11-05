import React from 'react';
import { Link } from 'react-router-dom';

// --- DADOS ESTÁTICOS DE DEMONSTRAÇÃO ---
// Para mudar o conteúdo dos cursos, edite este array.
const coursesData = [
    {
        id: 1,
        title: "SEBRAE - Vendas na prática: um passo a passo para encantar seu cliente",
        summary: "A forma como você aborda o seu cliente é determinante para o fechamento da venda! Desenvolva técnicas e habilidades para realizar um atendimento de sucesso.",
        // Use uma URL real ou salve a imagem na pasta assets/images/ (ex: course_fundamentos.jpg)
        image: "images/vendas.png", 
        link: "https://digital.sebraesp.com.br/unidade/atraia-mais-clientes/curso/vendas-na-pratica-um-passo-a-passo-para-encantar-seu-cliente", // Link para a página de detalhes ou inscrição do curso
    },
    {
        id: 2,
        title: "SEBRAE - Expansão no Mercado e Vendas",
        summary: "Saiba como aproveitar oportunidades de expansão do seu negócio no mercado e criar estratégias planejadas para alavancar seus resultados.",
        image: "images/mercado.png",
        link: "https://digital.sebraesp.com.br/unidade/atraia-mais-clientes/curso/expansao-no-mercado-e-vendas",
    },
    {
        id: 3,
        title: "SEBRAE - Entenda seu cliente e venda mais",
        summary: "Desenvolva um olhar apurado sobre o comportamento do seu público-alvo e aplique ações estratégicas para conquistar uma base sólida de clientes fiéis.",
        image: "images/cliente.png",
        link: "https://digital.sebraesp.com.br/unidade/atraia-mais-clientes/curso/entenda-seu-cliente-e-venda-mais",
    },
];

// Para mudar o conteúdo dos materiais, edite este array.
const materialsData = [
    {
        id: 101,
        title: "O homem mais rico da Babilônia",
        description: "Com mais de dois milhões de exemplares vendidos no mundo todo, O homem mais rico da Babilônia é um clássico sobre como multiplicar riqueza e solucionar problemas financeiros.",
        image: "images/homem.png",
        link: "https://www.amazon.com.br/Homem-Mais-Rico-Babil%C3%B4nia/dp/8595081530/ref=asc_df_8595081530",
    },
    {
        id: 102,
        title: "A psicologia financeira: lições atemporais sobre fortuna, ganância e felicidade",
        description: "O livro de educação financeira mais comentado dos últimos anos, com mais de 1 milhão de exemplares vendidos no mundo todo!",
        image: "images/psico.png",
        link: "https://www.amazon.com.br/psicologia-financeira-atemporais-gan%C3%A2ncia-felicidade/dp/6555111100/ref=asc_df_6555111100",
    },
];

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

function Cursos() {
    // Componente Card Reutilizável
    const ItemCard = ({ title, summary, image, link, buttonText = "Ver Detalhes" }) => (
        <article>
            <Link to={link} className="image">
                <img src={image || 'assets/images/pic01.jpg'} alt={title} />
            </Link>
            <h3>
                <Link to={link}>{title}</Link>
            </h3>
            <p>{summary}</p>
            <ul className="actions">
                <li>
                    <Link to={link} className="button">
                        {buttonText}
                    </Link>
                </li>
            </ul>
        </article>
    );

    return (
        <>
            <header className="major">
                <h1>Cursos e Materiais Indicados</h1>
            </header>

            {/* SEÇÃO 1: CURSOS ONLINE */}
            <section>
                <header className="major">
                    <h2>Cursos e Treinamentos</h2>
                </header>
                <div className="posts">
                    {coursesData.map(course => (
                        <ItemCard
                            key={course.id}
                            title={course.title}
                            summary={course.summary}
                            image={course.image}
                            link={course.link}
                            buttonText="Inscreva-se"
                        />
                    ))}
                </div>
            </section>

            {/* SEÇÃO 2: MATERIAIS PARA DOWNLOAD */}
            <section>
                <header className="major">
                    <h2>Materiais e Publicações</h2>
                </header>
                <div className="posts">
                    {materialsData.map(material => (
                        <ItemCard
                            key={material.id}
                            title={material.title}
                            summary={material.description}
                            image={material.image}
                            link={material.link}
                            buttonText="Baixar Material"
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

export default Cursos;
