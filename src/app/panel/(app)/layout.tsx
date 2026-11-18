import Link from "next/link";
import { Suspense } from "react";
import { LogoCompact } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { PanelNav } from "@/components/finops/nav";
import { createClient } from "@/lib/finops/supabase/server";
import { signOut } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  const { count } = await sb.from("members").select("*", { count: "exact", head: true });

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
        <Container className="flex h-16 items-stretch justify-between gap-6">
          <Link href="/panel" className="flex items-center gap-3" aria-label="Cota, panel de finanzas">
            <LogoCompact className="h-5" title="" />
            <span className="border-l border-line-strong pl-3 text-[0.9375rem] text-paper-muted">Finanzas</span>
          </Link>
          <Suspense>
            <PanelNav />
          </Suspense>
          <form action={signOut} className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-paper-subtle lg:inline">{data.user?.email}</span>
            <button className="text-[0.9375rem] text-paper-muted hover:text-paper">Salir</button>
          </form>
        </Container>
      </header>
      <Container className="pb-28 pt-10 sm:pt-14 md:pb-24">
        {count === 0 ? (
          <div className="max-w-xl">
            <h1 className="text-display-s font-[450]">Tu cuenta aún no tiene acceso.</h1>
            <p className="mt-4 text-paper-muted">
              Pide a alguien del equipo que añada <span className="text-paper">{data.user?.email}</span> en Socios, apartado Acceso.
            </p>
          </div>
        ) : (
          children
        )}
      </Container>
    </div>
  );
}
