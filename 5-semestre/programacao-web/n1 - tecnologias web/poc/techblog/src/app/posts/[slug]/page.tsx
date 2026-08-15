import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/posts";

// Força a renderização NO SERVIDOR a cada requisição (SSR puro):
// o horário exibido no selo abaixo muda a cada recarga da página.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

// generateMetadata: SEO dinâmico — o <title> da aba vem dos dados do post.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post não encontrado" };
  }
  return { title: post.titulo, description: post.resumo };
}

// Rota DINÂMICA: a pasta [slug] captura /posts/qualquer-coisa,
// e o valor chega ao componente via params.
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  // Slug inexistente -> renderiza o not-found.tsx mais próximo (404 real).
  if (!post) {
    notFound();
  }

  const renderizadoEm = new Date().toLocaleTimeString("pt-BR");

  return (
    <article className="artigo">
      <Link href="/" className="voltar">
        ← Todos os posts
      </Link>
      <header>
        <h1>{post.titulo}</h1>
        <div className="post-meta">
          <span>{post.autor}</span>
          <span>
            {new Date(`${post.data}T12:00:00`).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </header>
      <div className="conteudo">
        {post.conteudo.map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}
      </div>
      <div className="selo-ssr">
        Prova de SSR: este HTML foi renderizado no servidor às{" "}
        <code>{renderizadoEm}</code>. Recarregue a página (F5) e o horário
        muda — cada requisição gera uma nova renderização no servidor.
      </div>
    </article>
  );
}
