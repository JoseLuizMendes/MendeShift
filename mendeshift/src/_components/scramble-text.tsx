"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

interface ScrambleTextOnHoverProps {
  text: string;
  className?: string;
  duration?: number;
  as?: "span" | "button" | "div";
  onClick?: () => void;
  triggerToken?: number;
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
  triggerToken,
}: ScrambleTextOnHoverProps) {
  const [displayText, setDisplayText] = useState(text);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimating = useRef(false);
  const previousTriggerRef = useRef(triggerToken);
  const isControlledByParent = triggerToken !== undefined;

  const startScramble = useCallback(() => {
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

  const handleMouseEnter = useCallback(() => {
    startScramble();
  }, [startScramble]);

  useEffect(() => {
    if (triggerToken === undefined) return;

    if (previousTriggerRef.current === undefined) {
      previousTriggerRef.current = triggerToken;
      return;
    }

    if (triggerToken !== previousTriggerRef.current) {
      previousTriggerRef.current = triggerToken;
      startScramble();
    }
  }, [startScramble, triggerToken]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <Component
      className={cn(className, isControlledByParent && "pointer-events-none")}
      onMouseEnter={isControlledByParent ? undefined : handleMouseEnter}
      onClick={onClick}
    >
      {displayText}
    </Component>
  );
}
