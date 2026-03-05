"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface DrawTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
}

export function DrawText({
  text,
  className = "",
  duration = 0.08,
  delay = 0.5,
  stagger = 0.08,
}: DrawTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const intervalsRef = useRef<Array<ReturnType<typeof setInterval>>>([]);
  const [displayChars, setDisplayChars] = useState<string[]>(text.split("").map(() => ""));
  const [activeIndices, setActiveIndices] = useState<boolean[]>(text.split("").map(() => false));
  const [hasAnimated, setHasAnimated] = useState(false);

  const chars = text.split("");
  const flipChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+#@$%";

  const runTickerAnimation = useCallback(
    (animationDelay = 0) => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];

      setDisplayChars(text.split("").map(() => ""));
      setActiveIndices(text.split("").map(() => false));

      chars.forEach((targetChar, index) => {
        const letterDelay = animationDelay + index * stagger;

        gsap.delayedCall(letterDelay, () => {
          let flips = 0;
          const maxFlips = 8 + Math.floor(Math.random() * 5);

          const flipInterval = setInterval(() => {
            flips += 1;

            if (flips >= maxFlips) {
              clearInterval(flipInterval);
              setDisplayChars((prev) => {
                const next = [...prev];
                next[index] = targetChar;
                return next;
              });
              setActiveIndices((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
              return;
            }

            setDisplayChars((prev) => {
              const next = [...prev];
              next[index] = flipChars[Math.floor(Math.random() * flipChars.length)];
              return next;
            });
          }, duration * 1000);

          intervalsRef.current.push(flipInterval);
        });
      });
    },
    [chars, duration, stagger, text],
  );

  useEffect(() => {
    if (!containerRef.current || hasAnimated) return;
    const frame = requestAnimationFrame(() => {
      runTickerAnimation(delay);
      setHasAnimated(true);
    });

    return () => {
      cancelAnimationFrame(frame);
      intervalsRef.current.forEach(clearInterval);
    };
  }, [delay, hasAnimated, runTickerAnimation]);

  return (
    <h1
      ref={containerRef}
      className={className}
      onMouseEnter={() => runTickerAnimation(0)}
      style={{
        fontSize: "clamp(4rem, 14vw, 13rem)",
        lineHeight: 0.9,
        letterSpacing: "0.02em",
        display: "flex",
      }}
    >
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="relative inline-block px-[0.05em] transition-colors duration-100"
          style={{
            backgroundColor: activeIndices[index] ? "var(--accent)" : "transparent",
            color: activeIndices[index] ? "var(--accent-foreground)" : "var(--foreground)",
            minWidth: char === " " ? "0.3em" : undefined,
          }}
        >
          {displayChars[index] || (char === " " ? "\u00A0" : "")}
        </span>
      ))}
    </h1>
  );
}
