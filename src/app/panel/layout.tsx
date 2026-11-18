import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Finanzas", template: "%s · Finanzas · Cota" },
  robots: { index: false, follow: false },
};

export default function PanelRoot({ children }: { children: React.ReactNode }) {
  return children;
}
