"use client";

import { useState } from "react";
import { BitmapChevron } from "./bitmap-chevron";
import { ScrambleTextOnHover } from "./scramble-text";
import { Button } from "./ui/button";
import { StarBorder } from "./ui/star-border";

export function PortfolioCta({ href, label, className }: { href: string; label: string; className?: string }) {
  const [scrambleToken, setScrambleToken] = useState(0);
  const triggerScramble = () => setScrambleToken((current) => current + 1);

  return (
    <StarBorder className={className} innerClassName="bg-accent" thickness={2}>
      <Button href={href} variant="primary" className="group min-h-11 w-full justify-center" onMouseEnter={triggerScramble} onFocus={triggerScramble}>
        <ScrambleTextOnHover text={label} as="span" duration={0.55} className="text-[10px]" triggerToken={scrambleToken} />
        <BitmapChevron className="transition-transform interaction-motion group-hover:rotate-45 group-focus-visible:rotate-45 group-active:rotate-45" />
      </Button>
    </StarBorder>
  );
}
