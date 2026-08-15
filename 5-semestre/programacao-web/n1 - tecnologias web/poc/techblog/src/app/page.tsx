import Link from "next/link";
import { getPosts } from "@/lib/posts";

// Server Component ASSÍNCRONO: a busca de dados acontece no servidor,
// e o HTML chega pronto ao navegador (prove com Ctrl+U / view-source).
export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <section className="hero">
        <h1>TechBlog</h1>
        <p>
          Um mini-blog construído com Next.js para demonstrar Server-Side
          Rendering e roteamento por sistema de arquivos. Esta lista de posts
          foi buscada e renderizada no servidor.
        </p>
      </section>

      <section className="post-list">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="post-card"
          >
            <h2>{post.titulo}</h2>
            <p className="resumo">{post.resumo}</p>
            <div className="post-meta">
              <span>{post.autor}</span>
              <span>
                {new Date(`${post.data}T12:00:00`).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
