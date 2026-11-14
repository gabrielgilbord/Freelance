import Link from "next/link";
import { nav } from "@/content/site";
import { LogoCompact } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MobileNav } from "./mobile-nav";
import { HeaderShell } from "./header-shell";

export function Header() {
  return (
    <HeaderShell>
      <Container className="flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-50 -m-2 p-2 text-paper" aria-label="Cota, inicio">
          <LogoCompact title="" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-sm border border-line/80 bg-ink/60 p-1 backdrop-blur-md">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xs px-4 py-2 text-[0.9375rem] text-paper-muted transition-colors duration-300 hover:bg-ink-2 hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <ButtonLink href="/contacto" className="!h-9 !px-3.5 text-sm md:!h-10 md:!px-4">
            Hablemos
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
      {/* La cota del header: se completa al llegar al final de la página */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
        <div className="scroll-cota h-px w-full bg-accent" />
      </div>
    </HeaderShell>
  );
}
