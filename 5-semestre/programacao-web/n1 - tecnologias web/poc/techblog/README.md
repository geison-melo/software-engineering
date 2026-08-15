# TechBlog — PoC de Next.js (SSR e roteamento)

Prova de conceito do Seminário de Tecnologias WEB. Mini-blog que demonstra
**Server-Side Rendering** e **roteamento por sistema de arquivos** com
Next.js 16 (App Router) + React 19 + TypeScript.

## Como rodar

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000>.

Build de produção:

```bash
npm run build
npm start
```

## O que observar

| Conceito | Onde ver |
| -------- | -------- |
| SSR (Server Component assíncrono) | `src/app/page.tsx` — busca dados no servidor; confira com Ctrl+U que o conteúdo está no HTML |
| SSR por requisição | `src/app/posts/[slug]/page.tsx` — selo com horário de renderização muda a cada F5 (`dynamic = "force-dynamic"`) |
| Rota estática | `src/app/sobre/page.tsx` → `/sobre` |
| Rota dinâmica | `src/app/posts/[slug]/page.tsx` → `/posts/qualquer-slug` |
| Layout compartilhado | `src/app/layout.tsx` — navbar/rodapé em todas as páginas |
| Streaming SSR | `src/app/loading.tsx` — aparece enquanto os dados carregam |
| 404 customizada | `src/app/not-found.tsx` — teste `/posts/nao-existe` |
| SEO dinâmico | `generateMetadata` em `[slug]/page.tsx` — título da aba vem do post |

Os dados são locais (`src/lib/posts.ts`) com atraso artificial de 800 ms
simulando a latência de um banco — a demo não depende de internet.

O roteiro completo do live coding está em `../../docs/ROTEIRO-DEMO.md`.
