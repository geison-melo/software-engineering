// "Banco de dados" local do TechBlog.
// Em uma aplicação real, estes dados viriam de um banco ou de uma API;
// aqui usamos dados locais com um atraso artificial para simular a latência
// de rede e tornar visível o streaming SSR (loading.tsx) durante a demo.

export interface Post {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string; // ISO (AAAA-MM-DD)
  conteudo: string[]; // parágrafos
}

const posts: Post[] = [
  {
    slug: "o-que-e-ssr",
    titulo: "O que é Server-Side Rendering (SSR)?",
    resumo:
      "Entenda por que renderizar o HTML no servidor muda o jogo para SEO e performance.",
    autor: "Equipe TechBlog",
    data: "2026-08-10",
    conteudo: [
      "Server-Side Rendering (SSR) é a técnica em que o HTML de uma página é gerado no servidor, a cada requisição, e enviado pronto para o navegador. O usuário recebe conteúdo visível de imediato, sem esperar o JavaScript baixar e executar.",
      "Em uma SPA tradicional (Single-Page Application), o servidor devolve um HTML praticamente vazio com uma tag <div id=\"root\"> e um bundle JavaScript. Só depois que esse bundle é baixado, interpretado e executado é que o conteúdo aparece — o que atrasa a primeira renderização e prejudica o SEO.",
      "Com SSR, mecanismos de busca e redes sociais enxergam o conteúdo completo da página no HTML, e o usuário percebe o carregamento como muito mais rápido. Depois que o HTML chega, o React 'hidrata' a página, ligando os eventos e tornando-a interativa.",
      "Você pode provar que esta página foi renderizada no servidor agora mesmo: abra o código-fonte (Ctrl+U) e procure por este texto — ele está no HTML, antes de qualquer JavaScript rodar.",
    ],
  },
  {
    slug: "roteamento-por-arquivos",
    titulo: "Roteamento por sistema de arquivos no Next.js",
    resumo:
      "No App Router, a estrutura de pastas define as rotas: sem configuração, sem biblioteca externa.",
    autor: "Equipe TechBlog",
    data: "2026-08-11",
    conteudo: [
      "No Next.js, você não instala um roteador nem escreve tabelas de rotas: a estrutura de pastas dentro de src/app É o mapa de rotas da aplicação. Cada pasta vira um segmento de URL, e o arquivo page.tsx dentro dela é a página servida naquele caminho.",
      "Rotas dinâmicas usam colchetes no nome da pasta: esta própria página que você está lendo é servida por src/app/posts/[slug]/page.tsx. O valor 'roteamento-por-arquivos' da URL chega ao componente como parâmetro, e o servidor busca o post correspondente.",
      "Arquivos especiais completam o sistema: layout.tsx define a interface compartilhada entre páginas (como a barra de navegação deste blog), loading.tsx aparece automaticamente enquanto os dados carregam, e not-found.tsx é exibido quando a rota ou o recurso não existe.",
      "O resultado é uma convenção previsível: para saber quais rotas uma aplicação Next.js tem, basta olhar a árvore de pastas.",
    ],
  },
  {
    slug: "spa-vs-ssr",
    titulo: "SPA vs SSR: quando cada abordagem faz sentido",
    resumo:
      "Comparando a renderização no cliente com a renderização no servidor, com prós e contras.",
    autor: "Equipe TechBlog",
    data: "2026-08-12",
    conteudo: [
      "Uma SPA renderiza tudo no navegador: o servidor entrega um esqueleto vazio e o JavaScript constrói a interface. Isso funciona muito bem para aplicações fechadas atrás de login — painéis administrativos, dashboards, ferramentas internas — onde SEO não importa e o usuário tolera um carregamento inicial.",
      "Já sites públicos — e-commerce, blogs, portais de notícias, páginas de produto — dependem de SEO e da primeira impressão de velocidade. Nesses casos, SSR entrega o conteúdo pronto no primeiro byte de HTML, e a diferença aparece direto nas métricas de Core Web Vitals, como o First Contentful Paint.",
      "O Next.js permite misturar as duas abordagens na mesma aplicação: páginas públicas renderizadas no servidor e trechos interativos ('use client') renderizados no navegador. Não é uma escolha binária — é uma escolha por página, e até por componente.",
    ],
  },
  {
    slug: "por-que-o-mercado-usa-nextjs",
    titulo: "Por que o mercado usa Next.js?",
    resumo:
      "Netflix, TikTok, Twitch e Nike usam Next.js em produção. Os motivos vão além do SSR.",
    autor: "Equipe TechBlog",
    data: "2026-08-13",
    conteudo: [
      "O React, sozinho, é apenas uma biblioteca de componentes: ele não opina sobre roteamento, busca de dados, otimização de imagens ou build de produção. Cada equipe acabava montando (e mantendo) seu próprio quebra-cabeça de ferramentas.",
      "O Next.js empacota essas decisões em um framework com convenções fortes: roteamento por arquivos, renderização no servidor por padrão, otimização automática de imagens e fontes, e divisão de código por rota — tudo funcionando sem configuração.",
      "Empresas como Netflix, TikTok, Twitch, Nike e OpenAI usam Next.js em produção. Para o mercado, a vantagem competitiva é dupla: páginas públicas com SEO e performance de site estático, e produtividade de desenvolvimento com um caminho pavimentado pela comunidade.",
    ],
  },
  {
    slug: "server-components",
    titulo: "React Server Components: o pilar do App Router",
    resumo:
      "Componentes que executam apenas no servidor: menos JavaScript no cliente, acesso direto aos dados.",
    autor: "Equipe TechBlog",
    data: "2026-08-14",
    conteudo: [
      "No App Router, todo componente é um Server Component por padrão: ele executa no servidor, pode ser assíncrono e pode acessar banco de dados, arquivos ou APIs diretamente — sem criar endpoints intermediários e sem expor segredos ao navegador.",
      "A consequência mais importante: o código de um Server Component nunca é enviado ao cliente. A página deste blog busca os posts com um simples 'await' dentro do componente, e nada dessa lógica vai para o bundle JavaScript do navegador.",
      "Quando a interatividade é necessária — um botão, um formulário, um estado local — basta marcar aquele componente específico com a diretiva 'use client'. O resto da árvore continua no servidor. Essa é a arquitetura que permite ao Next.js entregar páginas ricas com o mínimo de JavaScript no cliente.",
    ],
  },
];

// Simula a latência de um banco de dados / API remota.
// O atraso torna o loading.tsx (streaming SSR) visível durante a demonstração.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPosts(): Promise<Post[]> {
  await delay(800);
  return [...posts].sort((a, b) => b.data.localeCompare(a.data));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  await delay(800);
  return posts.find((p) => p.slug === slug);
}
