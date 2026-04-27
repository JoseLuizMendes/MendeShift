import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "outline" | "ghost";

type Props = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  variant?: Variant;
};

export function ActionLink({
  className,
  variant = "outline",
  href,
  ...props
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-mono text-xs uppercase tracking-widest transition-colors",
        variant === "outline" &&
          "border border-foreground/20 px-6 py-3 text-foreground hover:border-accent hover:text-accent",
        variant === "ghost" &&
          "px-1 py-3 text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
