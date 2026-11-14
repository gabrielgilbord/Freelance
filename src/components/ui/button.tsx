import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-strong px-5 h-12 sm:h-13 rounded-xs font-medium",
  secondary:
    "border border-line-strong text-paper hover:border-paper/70 hover:bg-paper/[0.04] px-5 h-12 sm:h-13 rounded-xs font-medium",
  text: "text-paper hover:text-accent font-medium",
};

type Common = { variant?: Variant; arrow?: boolean; children: ReactNode; className?: string };

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          size={18}
          className="transition-transform duration-500 ease-out-quint group-hover:translate-x-1"
        />
      )}
    </>
  );
}

const cls = (variant: Variant, className = "") =>
  `group inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.9375rem] leading-none [text-box:trim-both_cap_alphabetic] transition-colors duration-300 ${styles[variant]} ${className}`;

export function ButtonLink({ variant = "primary", arrow, children, className, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cls(variant, className)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

export function Button({ variant = "primary", arrow, children, className, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={cls(variant, `disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
