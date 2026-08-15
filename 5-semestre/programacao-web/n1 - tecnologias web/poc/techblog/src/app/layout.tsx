import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Metadados padrão da aplicação (SEO) — páginas podem sobrescrever.
export const metadata: Metadata = {
  title: {
    default: "TechBlog — Next.js na prática",
    template: "%s | TechBlog",
  },
  description:
    "Prova de conceito de Next.js: Server-Side Rendering (SSR) e roteamento por sistema de arquivos.",
};

// layout.tsx: interface COMPARTILHADA entre todas as rotas.
// A navbar e o rodapé aparecem em todas as páginas sem re-renderizar na navegação.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">
              Tech<span>Blog</span>
            </Link>
            <nav>
              <Link href="/">Início</Link>
              <Link href="/sobre">Sobre</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          Prova de conceito — Seminário Tecnologias WEB · Next.js: SSR e
          roteamento
        </footer>
      </body>
    </html>
  );
}
