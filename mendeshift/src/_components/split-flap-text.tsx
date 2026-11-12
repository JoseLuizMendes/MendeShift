"use client";

import type React from "react";
import { prefersReducedMotion } from "@/lib/motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
}

const SplitFlapAudioContext = createContext<AudioContextType | null>(null);

function useSplitFlapAudio() {
  return useContext(SplitFlapAudioContext);
}

export function SplitFlapAudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const mutedRef = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (mutedRef.current) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(880 + Math.random() * 260, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.015);

      gainNode.gain.setValueAtTime(0.035, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.02);
    } catch {
      // no-op
    }
  }, [getAudioContext]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setIsMuted(mutedRef.current);
  }, []);

  const value = useMemo(() => ({ isMuted, toggleMute, playClick }), [isMuted, toggleMute, playClick]);

  return (
    <SplitFlapAudioContext.Provider value={value}>{children}</SplitFlapAudioContext.Provider>
  );
}

export function SplitFlapMuteToggle({ className = "" }: { className?: string }) {
  const audio = useSplitFlapAudio();
  if (!audio) return null;

  return (
    <button
      type="button"
      onClick={audio.toggleMute}
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-foreground ${className}`}
    >
      {/* Ícone decorativo — o nome acessível vem do texto visível abaixo
          (WCAG 2.5.3: aria-label não pode divergir do texto visível). */}
      {audio.isMuted ? (
        <VolumeX aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Volume2 aria-hidden="true" className="h-4 w-4" />
      )}
      <span>{audio.isMuted ? "Som Desligado" : "Som Ligado"}</span>
    </button>
  );
}

interface SplitFlapTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const INTRO_KEY = "mendeshift:split-flap-played";
let playedInPage = false;

export function SplitFlapText({ text, className = "", speed = 50 }: SplitFlapTextProps) {
  const chars = useMemo(() => text.split(""), [text]);
  const [animate, setAnimate] = useState(false);
  const audio = useSplitFlapAudio();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const frame = requestAnimationFrame(() => {
      if (playedInPage) return;
      try {
        if (sessionStorage.getItem(INTRO_KEY)) return;
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        // Storage can be unavailable. The page flag still prevents replays on navigation.
      }
      playedInPage = true;
      setAnimate(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-[0.08em] ${className}`}
      role="img"
      aria-label={text}
      style={{ perspective: "1000px" }}
    >
      {chars.map((char, index) => (
        <SplitFlapChar
          key={index}
          char={char.toUpperCase()}
          index={index}
          speed={speed}
          animate={animate}
          playClick={audio?.playClick}
        />
      ))}
    </div>
  );
}

function SplitFlapChar({
  char,
  index,
  speed,
  animate,
  playClick,
}: {
  char: string;
  index: number;
  speed: number;
  animate: boolean;
  playClick?: () => void;
}) {
  const displayChar = CHARSET.includes(char) ? char : " ";
  const isSpace = char === " ";
  const [currentChar, setCurrentChar] = useState(displayChar);
  const [isSettled, setIsSettled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isSpace || !animate) return;
    // Reduced motion: sem flip — o estado inicial já é o caractere final.
    if (prefersReducedMotion()) return;

    let flipIndex = 0;
    const settleThreshold = 8 + index * 2;

    timeoutRef.current = setTimeout(() => {
      setIsSettled(false);
      setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)]);

      intervalRef.current = setInterval(() => {
        if (flipIndex >= settleThreshold) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setCurrentChar(displayChar);
          setIsSettled(true);
          playClick?.();
          return;
        }

        setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)]);
        if (flipIndex % 2 === 0) playClick?.();
        flipIndex += 1;
      }, speed);
    }, index * 120);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [displayChar, index, isSpace, speed, animate, playClick]);

  if (isSpace) {
    return <div style={{ width: "0.3em", fontSize: "clamp(2.2rem, 12vw, 14rem)" }} />;
  }

  return (
    <div
      // Entrada fade-in-up escalonada em CSS puro (keyframe flap-in no
      // globals.css) — era o único uso de framer-motion no projeto.
      className={`relative flex items-center justify-center overflow-hidden font-display ${animate ? "flap-enter" : ""}`}
      style={{
        animationDelay: `${0.1 * index}s`,
        fontSize: "clamp(2.2rem, 12vw, 14rem)",
        width: "0.65em",
        height: "1.05em",
        backgroundColor: isSettled
          ? "color-mix(in oklab, var(--foreground) 10%, var(--background))"
          : "color-mix(in oklab, var(--accent) 18%, var(--background))",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/20" />
      <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end justify-center overflow-hidden">
        <span
          className="translate-y-[0.52em] leading-none"
          style={{
            color: isSettled
              ? "var(--accent)"
              : "color-mix(in oklab, var(--accent) 75%, var(--foreground))",
          }}
        >
          {currentChar}
        </span>
      </div>
      <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start justify-center overflow-hidden">
        <span
          className="-translate-y-[0.52em] leading-none"
          style={{
            color: isSettled
              ? "var(--accent)"
              : "color-mix(in oklab, var(--accent) 75%, var(--foreground))",
          }}
        >
          {currentChar}
        </span>
      </div>
    </div>
  );
}
