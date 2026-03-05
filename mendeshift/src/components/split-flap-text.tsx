"use client";

import type React from "react";
import { motion } from "framer-motion";
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
    if (isMuted) return;

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
  }, [isMuted, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
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
      aria-label={audio.isMuted ? "Ativar som" : "Silenciar som"}
    >
      {audio.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{audio.isMuted ? "Sound Off" : "Sound On"}</span>
    </button>
  );
}

interface SplitFlapTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

export function SplitFlapText({ text, className = "", speed = 50 }: SplitFlapTextProps) {
  const chars = useMemo(() => text.split(""), [text]);
  const [animationKey, setAnimationKey] = useState(0);
  const audio = useSplitFlapAudio();

  return (
    <div
      className={`inline-flex cursor-pointer items-center gap-[0.08em] ${className}`}
      aria-label={text}
      onMouseEnter={() => setAnimationKey((prev) => prev + 1)}
      style={{ perspective: "1000px" }}
    >
      {chars.map((char, index) => (
        <SplitFlapChar
          key={`${index}-${animationKey}`}
          char={char.toUpperCase()}
          index={index}
          animationKey={animationKey}
          speed={speed}
          playClick={audio?.playClick}
        />
      ))}
    </div>
  );
}

function SplitFlapChar({
  char,
  index,
  animationKey,
  speed,
  playClick,
}: {
  char: string;
  index: number;
  animationKey: number;
  speed: number;
  playClick?: () => void;
}) {
  const displayChar = CHARSET.includes(char) ? char : " ";
  const isSpace = char === " ";
  const [currentChar, setCurrentChar] = useState(displayChar);

  useEffect(() => {
    if (isSpace) return;

    let flipIndex = 0;
    const settleThreshold = 8 + index * 2;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (flipIndex >= settleThreshold) {
          clearInterval(interval);
          setCurrentChar(displayChar);
          playClick?.();
          return;
        }

        setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)]);
        if (flipIndex % 2 === 0) playClick?.();
        flipIndex += 1;
      }, speed);

      return () => clearInterval(interval);
    }, index * 120);

    return () => {
      clearTimeout(timeout);
    };
  }, [displayChar, index, isSpace, animationKey, speed, playClick]);

  if (isSpace) {
    return <div style={{ width: "0.3em", fontSize: "clamp(4rem, 15vw, 14rem)" }} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.3, ease: "easeOut" }}
      className="relative flex items-center justify-center overflow-hidden font-display"
      style={{
        fontSize: "clamp(4rem, 15vw, 14rem)",
        width: "0.65em",
        height: "1.05em",
        backgroundColor: "hsl(0 0% 0%)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/20" />
      <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end justify-center overflow-hidden">
        <span className="translate-y-[0.52em] leading-none text-foreground">{currentChar}</span>
      </div>
      <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start justify-center overflow-hidden">
        <span className="-translate-y-[0.52em] leading-none text-foreground">{currentChar}</span>
      </div>
    </motion.div>
  );
}
