import Link from "next/link";

// not-found.tsx: página exibida quando a rota não existe ou quando um
// Server Component chama notFound() — ex.: /posts/um-slug-que-nao-existe.
export default function NotFound() {
  return (
    <div className="nao-encontrado">
      <h1>404</h1>
      <p>
        Esta página não existe. No App Router, este arquivo especial
        (not-found.tsx) cuida de todas as rotas não encontradas.
      </p>
      <Link href="/" className="botao">
        Voltar ao início
      </Link>
    </div>
  );
}
