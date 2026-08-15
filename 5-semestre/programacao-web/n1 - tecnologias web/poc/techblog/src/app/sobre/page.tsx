import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre a prova de conceito do seminário de Tecnologias WEB.",
};

// Rota ESTÁTICA: a pasta src/app/sobre/ vira a URL /sobre.
// Sem busca de dados, o Next.js pré-renderiza esta página no build.
export default function Sobre() {
  return (
    <div className="sobre">
      <h1>Sobre esta prova de conceito</h1>
      <p>
        Este mini-blog foi construído para o Seminário de Tecnologias WEB e
        demonstra os dois conceitos centrais do tema da equipe:
      </p>
      <ul>
        <li>
          <strong>Server-Side Rendering (SSR)</strong> — as páginas são Server
          Components assíncronos: os dados são buscados no servidor e o HTML
          chega pronto ao navegador. Abra o código-fonte de qualquer post
          (Ctrl+U) e veja o conteúdo dentro do HTML.
        </li>
        <li>
          <strong>Roteamento por sistema de arquivos</strong> — cada pasta em{" "}
          <code>src/app</code> é uma rota: esta página vive em{" "}
          <code>src/app/sobre/page.tsx</code>; os posts usam a rota dinâmica{" "}
          <code>src/app/posts/[slug]/page.tsx</code>.
        </li>
      </ul>
      <p>Arquivos especiais do App Router usados no projeto:</p>
      <ul>
        <li>
          <code>layout.tsx</code> — navbar e rodapé compartilhados entre todas
          as páginas;
        </li>
        <li>
          <code>loading.tsx</code> — estado de carregamento automático
          (streaming SSR);
        </li>
        <li>
          <code>not-found.tsx</code> — página 404 (teste acessar{" "}
          <code>/posts/nao-existe</code>).
        </li>
      </ul>
      <p>
        Stack: Next.js 16 · React 19 · TypeScript. Os dados são locais (em{" "}
        <code>src/lib/posts.ts</code>) com um atraso artificial que simula a
        latência de um banco de dados.
      </p>
    </div>
  );
}
