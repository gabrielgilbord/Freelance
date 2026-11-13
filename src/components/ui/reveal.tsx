"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
} & ComponentPropsWithoutRef<T>;

/**
 * Revelado al entrar en el viewport con un único IntersectionObserver por
 * elemento y CSS puro para la animación (sin librerías de animación).
 */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, style, ...props }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.in = "true";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Tag ref={ref} data-reveal="" style={{ ...style, "--reveal-delay": `${delay}ms` }} {...props} />;
}
