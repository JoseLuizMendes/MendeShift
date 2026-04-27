"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const COMMAND = "hire jose.mendes --role=product-engineer";
const CHAR_DELAY = 38; // ms per character

const RESPONSES = [
  { text: "fetching assets..." },
  { text: "compiling routes..." },
  { text: "rendering portfolio..." },
];

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [cmdDone, setCmdDone] = useState(false);
  const [readyCursor, setReadyCursor] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const cmdTextRef = useRef<HTMLSpanElement>(null);

  // Each response line: container div + text span + checkmark span
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const checkRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const readyLineRef = useRef<HTMLDivElement>(null);
  const readyTextRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const exitedRef = useRef(false);
  const cancelRef = useRef(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  const triggerExit = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    cancelRef.current = true;
    cleanupListenersRef.current?.();

    // Snap page to top while overlay is still fully visible
    window.dispatchEvent(new CustomEvent("lenis:scrollToTop"));

    const tl = gsap.timeline();
    tl.to(hintRef.current, { opacity: 0, duration: 0.18, ease: "power1.in" });

    const allLines = [
      document.getElementById("__pre-cmd"),
      ...lineRefs.current,
      readyLineRef.current,
    ].filter(Boolean);

    tl.to(
      allLines,
      { y: -22, opacity: 0, stagger: 0.05, duration: 0.32, ease: "power2.in" },
      "-=0.08",
    );
    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.48, ease: "power2.inOut" },
      "-=0.14",
    );
    tl.call(() => {
      window.dispatchEvent(new CustomEvent("preloader:done"));
      setVisible(false);
    });
  };

  useEffect(() => {
    // Show on hard load (first visit or refresh), not on client-side navigation.
    // performance.navigation.type: 0 = navigate, 1 = reload
    const navType = (
      performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    )?.type;
    const isHardLoad = navType === "navigate" || navType === "reload";
    if (isHardLoad) {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    cancelRef.current = false;

    // Attach exit listeners
    const onKey = () => triggerExit();
    const onWheel = () => triggerExit();
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: true });
    cleanupListenersRef.current = () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
    };

    // Helper: type text char by char into an element
    const typeInto = (el: HTMLElement | null, text: string): Promise<void> =>
      new Promise((resolve) => {
        if (!el) { resolve(); return; }
        el.textContent = "";
        let i = 0;
        const id = setInterval(() => {
          if (cancelRef.current) { clearInterval(id); resolve(); return; }
          i++;
          el.textContent = text.slice(0, i);
          if (i >= text.length) { clearInterval(id); resolve(); }
        }, CHAR_DELAY);
      });

    const pause = (ms: number): Promise<void> =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms);
        // cancelRef check handled by the caller after await
        return () => clearTimeout(id);
      });

    // Set initial hidden states
    gsap.set(lineRefs.current.filter(Boolean), { opacity: 0 });
    gsap.set(checkRefs.current.filter(Boolean), { opacity: 0 });
    gsap.set(readyLineRef.current, { opacity: 0 });
    gsap.set(hintRef.current, { opacity: 0 });

    const run = async () => {
      // 1. Type the command
      await typeInto(cmdTextRef.current, COMMAND);
      if (cancelRef.current) return;
      setCmdDone(true);

      // 2. Brief pause — Enter was pressed
      await pause(420);
      if (cancelRef.current) return;

      // 3. Type each response line
      for (let i = 0; i < RESPONSES.length; i++) {
        gsap.set(lineRefs.current[i], { opacity: 1 });
        await typeInto(lineTextRefs.current[i], RESPONSES[i].text);
        if (cancelRef.current) return;
        gsap.to(checkRefs.current[i], { opacity: 1, duration: 0.18 });
        await pause(300);
        if (cancelRef.current) return;
      }

      // 4. Type ready_
      gsap.set(readyLineRef.current, { opacity: 1 });
      await typeInto(readyTextRef.current, "ready_");
      if (cancelRef.current) return;
      setReadyCursor(true);

      // 5. Hint fades in
      await pause(900);
      if (cancelRef.current) return;
      gsap.to(hintRef.current, { opacity: 1, duration: 0.6, ease: "power1.out" });
    };

    run();

    return () => {
      cancelRef.current = true;
      cleanupListenersRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted || !visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={triggerExit}
      onTouchStart={triggerExit}
      className="fixed inset-0 z-9999 flex cursor-pointer select-none items-center justify-center bg-background"
      aria-hidden="true"
    >
      {/* Corner labels */}
      <span className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/30 sm:left-8 sm:top-8">
        MendeShift
      </span>
      <span className="absolute right-5 top-5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/30 sm:right-8 sm:top-8">
        v1.0.0
      </span>

      {/* Terminal block */}
      <div className="flex flex-col gap-2.5 px-6">

        {/* Command line */}
        <div id="__pre-cmd" className="flex items-center gap-2 font-mono text-sm tracking-wide">
          <span className="text-accent">$</span>
          <span ref={cmdTextRef} className="text-foreground" />
          {!cmdDone && (
            <span className="inline-block h-[0.85em] w-[2px] animate-[blink_1s_step-end_infinite] bg-foreground/60 align-text-bottom" />
          )}
        </div>

        {/* Response lines */}
        {RESPONSES.map((_, i) => (
          <div
            key={i}
            ref={(el) => { lineRefs.current[i] = el; }}
            className="flex items-center gap-2 font-mono text-sm tracking-wide"
          >
            <span className="text-accent/50">&gt;</span>
            <span
              ref={(el) => { lineTextRefs.current[i] = el; }}
              className="text-muted-foreground"
            />
            <span
              ref={(el) => { checkRefs.current[i] = el; }}
              className="text-emerald-500/80"
              style={{ fontSize: "11px" }}
            >
              ✓
            </span>
          </div>
        ))}

        {/* ready_ */}
        <div
          ref={readyLineRef}
          className="mt-1 flex items-center gap-2 font-mono text-sm tracking-wide"
        >
          <span className="text-accent/50">&gt;</span>
          <span ref={readyTextRef} className="text-foreground/80" />
          {readyCursor && (
            <span className="inline-block h-[0.85em] w-[2px] animate-[blink_1s_step-end_infinite] bg-accent align-text-bottom" />
          )}
        </div>
      </div>

      {/* Hint */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/40">
          <span className="text-accent/50">press any key</span> or{" "}
          <span className="text-accent/50">scroll</span> to enter
        </p>
      </div>

      {/* Bottom accent */}
      <span className="absolute bottom-0 left-0 h-px w-full bg-accent/20" />
    </div>
  );
}
