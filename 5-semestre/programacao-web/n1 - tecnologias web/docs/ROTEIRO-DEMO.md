# Roteiro da demonstração — TechBlog

Passo a passo do live coding da apresentação. Também é o guia para gravar o
vídeo de backup: basta gravar a tela executando estes mesmos passos.

## Antes da apresentação

- [ ] Node.js instalado na máquina da apresentação (`node --version` — testado com Node 24)
- [ ] Dependências instaladas: `npm install` dentro de `poc/techblog`
- [ ] Testar `npm run dev` e abrir `http://localhost:3000` antes da aula
- [ ] Vídeo de backup gravado e acessível offline (pen drive + nuvem)
- [ ] Fechar outras abas e aplicativos; navegador com zoom ~125% para a plateia ler

## Passo 0 — Subir o servidor

```bash
cd poc/techblog
npm run dev
```

Abrir `http://localhost:3000`.

## Passo 1 — O setup

Mostrar no editor o arquivo `poc/techblog/package.json`:

- Apenas 3 dependências de produção: `next`, `react`, `react-dom`.
- Scripts: `dev` (desenvolvimento), `build` (produção), `start` (servir o build).

Mostrar a árvore de pastas `src/app/` no editor e antecipar a ideia:
cada pasta é uma rota.

## Passo 2 — Home: SSR + streaming

1. Abrir `http://localhost:3000`.
2. Apontar o estado "Buscando dados no servidor…" que aparece por ~1s:
   é o arquivo `loading.tsx`, exibido automaticamente enquanto o Server
   Component busca os dados (streaming SSR). O atraso é artificial —
   simula um banco de dados — justamente para esse estado ser visível.
3. Mostrar o código de `src/app/page.tsx`: o componente é `async` e faz
   `await getPosts()` no servidor. Não existe `useEffect` nem `fetch`
   no navegador.

## Passo 3 — A prova do SSR

1. Clicar no post "O que é Server-Side Rendering (SSR)?".
2. Pressionar Ctrl+U (view-source) e usar Ctrl+F para procurar um trecho
   do texto do post (ex.: "hidrata").
   - O conteúdo está no HTML que o servidor enviou — é isso que o Google
     indexa e o usuário recebe de imediato.
   - Comparar: numa SPA pura, o view-source mostraria só `<div id="root">`.
3. Mostrar o selo azul no fim do post com o horário de renderização.
   Pressionar F5 algumas vezes: o horário muda a cada recarga —
   cada requisição é renderizada no servidor naquele instante
   (`export const dynamic = "force-dynamic"`).

## Passo 4 — Roteamento por sistema de arquivos

Com o editor e o navegador lado a lado:

| No editor                         | No navegador                    |
| --------------------------------- | ------------------------------- |
| `src/app/page.tsx`                | `/`                             |
| `src/app/sobre/page.tsx`          | `/sobre`                        |
| `src/app/posts/[slug]/page.tsx`   | `/posts/o-que-e-ssr` (qualquer slug) |

1. Navegar para `/sobre` — rota estática: a pasta `sobre/` virou a URL.
2. Voltar e abrir outro post — a mesma `[slug]/page.tsx` atende todos os
   posts; mostrar no código o `await params` que recebe o slug da URL.
3. Apontar o `layout.tsx`: a navbar não pisca entre navegações — é o layout
   compartilhado.
4. Digitar na barra de endereços `/posts/nao-existe`: o `notFound()` no código
   dispara a página 404 customizada (`not-found.tsx`).

## Passo 5 — Se der tempo: build de produção

```bash
npm run build
```

Mostrar a tabela que o Next.js imprime ao final:

- `○ (Static)` — `/` e `/sobre` pré-renderizadas no build;
- `ƒ (Dynamic)` — `/posts/[slug]` renderizada no servidor a cada requisição.

Um framework, duas estratégias de renderização, escolhidas por página.

## Plano B

1. Vídeo gravado seguindo este roteiro.
2. O projeto está no repositório do semestre — qualquer máquina com Node
   instalado reproduz a demo com `npm install && npm run dev`.
