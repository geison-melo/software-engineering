// loading.tsx: exibido AUTOMATICAMENTE pelo App Router enquanto os
// Server Components desta rota buscam dados (streaming SSR / Suspense).
// O atraso artificial em lib/posts.ts torna este estado visível na demo.
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Buscando dados no servidor…</p>
    </div>
  );
}
