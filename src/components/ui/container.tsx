import type { ComponentProps } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-[90rem] px-4 sm:px-8 lg:px-12 ${className}`} {...props} />;
}
