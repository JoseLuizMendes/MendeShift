"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ScrambleTextOnHoverProps {
  text: string;
  className?: string;
  duration?: number;
  as?: "span" | "button" | "div";
  onClick?: () => void;
}

const GLYPHS = "!@#$%^&*()_+-=<>?/\\[]{}Xx";

function runScramble(
  text: string,
  duration: number,
  setDisplayText: (text: string) => void,
  onComplete?: () => void,
): gsap.core.Tween {
  const lockedIndices = new Set<number>();
  const finalChars = text.split("");
  const totalChars = finalChars.length;
  const state = { progress: 0 };

  return gsap.to(state, {
    progress: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const numLocked = Math.floor(state.progress * totalChars);
      for (let i = 0; i < numLocked; i++) lockedIndices.add(i);

      const next = finalChars
        .map((char, i) => {
          if (lockedIndices.has(i)) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayText(next);
    },
    onComplete: () => {
      setDisplayText(text);
      onComplete?.();
    },
  });
}

export function ScrambleTextOnHover({
  text,
  className,
  duration = 0.4,
  as: Component = "span",
  onClick,
}: ScrambleTextOnHoverProps) {
  const [displayText, setDisplayText] = useState(text);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimating = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    tweenRef.current?.kill();

    const scrambled = text
      .split("")
      .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
      .join("");
    setDisplayText(scrambled);

    tweenRef.current = runScramble(text, duration, setDisplayText, () => {
      isAnimating.current = false;
    });
  }, [text, duration]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <Component className={className} onMouseEnter={handleMouseEnter} onClick={onClick}>
      {displayText}
    </Component>
  );
}
