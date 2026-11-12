"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rotations = [
  [105, 18, -12], [28, -110, 15], [-92, 58, 20],
  [16, 115, -18], [-112, -30, 11], [62, -82, -21],
];

export function ProcessPuzzle({ children }: { children: ReactNode }) {
  const puzzleRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const puzzle = puzzleRef.current;
    if (!puzzle) return;
    const media = gsap.matchMedia();

    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px)",
      tablet: "(min-width: 640px) and (max-width: 1023px)",
    }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const columns = conditions.desktop ? 3 : conditions.tablet ? 2 : 1;

      Array.from(puzzle.children).forEach((piece, index) => {
        const face = piece.querySelector(".process-piece-face");
        if (!face) return;
        const [rotationX, rotationY, rotationZ] = rotations[index % rotations.length];
        const column = index % columns;
        const horizontal = (column - (columns - 1) / 2) * 85 + rotationY / 3;
        const arrival = gsap.timeline({
          scrollTrigger: {
            trigger: piece,
            start: `top ${96 - column * 10}%`,
            end: `top ${54 - column * 10}%`,
            scrub: true,
          },
        });

        arrival.fromTo(face, {
          visibility: "hidden",
          z: 740,
          xPercent: horizontal,
          yPercent: 90,
          rotationX,
          rotationY,
          rotationZ,
        }, {
          visibility: "visible",
          z: 0,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          duration: 1,
          ease: "power2.out",
        }).fromTo(face, { "--process-edge-opacity": 1 }, {
          "--process-edge-opacity": 0,
          duration: .08,
          ease: "none",
        }, .92);
      });
    });

    return () => media.revert();
  }, []);

  return <ol ref={puzzleRef} className="process-puzzle">{children}</ol>;
}
