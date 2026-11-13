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
        <Link href="/" className="relative z-50 -m-2 p-2 text-paper" aria-label="Cota — inicio">
          <LogoCompact />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline py-1 text-[0.9375rem] text-paper-muted transition-colors hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/contacto" variant="secondary" className="!h-10 !px-4 text-sm">
            Hablemos
          </ButtonLink>
        </div>

        <MobileNav />
      </Container>
    </HeaderShell>
  );
}
