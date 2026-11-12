"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import type { LabStudy } from "@/lib/lab-studies";
import { Button } from "./ui/button";

type GalleryLabels = {
  title: string;
  previous: string;
  next: string;
  prompt: string;
  copy: string;
  copied: string;
  copyError: string;
};

export function LabGallery({ studies, labels }: { studies: LabStudy[]; labels: GalleryLabels }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ id: string; status: "copied" | "copyError" }>();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const study = studies[index];
  const imagePath = (id: string) => `/portfolio/lab/${id}.webp`;

  function step(direction: number) {
    setFeedback(undefined);
    setIndex((current) => (current + direction + studies.length) % studies.length);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(study.prompt);
      setFeedback({ id: study.id, status: "copied" });
    } catch {
      setFeedback({ id: study.id, status: "copyError" });
    }
  }

  return (
    <section className="lab-gallery" aria-label={labels.title}>
      <div
        className="lab-gallery-image"
        onTouchStart={(event) => {
          const finger = event.touches[0];
          touchStart.current = event.touches.length === 1 ? { x: finger.clientX, y: finger.clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const finger = event.changedTouches[0];
          const horizontal = finger.clientX - start.x;
          if (Math.abs(horizontal) > 44 && Math.abs(horizontal) > Math.abs(finger.clientY - start.y)) {
            step(horizontal < 0 ? 1 : -1);
          }
        }}
      >
        <Image
          key={study.id}
          src={imagePath(study.id)}
          alt={study.alt}
          fill
          sizes="(max-width: 900px) 94vw, (max-width: 1600px) 68vw, 1070px"
          quality={90}
          loading="eager"
        />
        <span className="portfolio-grain lab-gallery-grain" aria-hidden="true" />
      </div>
      <div className="lab-gallery-panel">
        <div className="lab-gallery-controls">
          <Button type="button" className="size-11 p-0" aria-label={labels.previous} onClick={() => step(-1)}>
            <ArrowLeft aria-hidden="true" className="size-4" />
          </Button>
          <span className="portfolio-mono tabular-nums text-muted-foreground" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(studies.length).padStart(2, "0")}
          </span>
          <Button type="button" className="size-11 p-0" aria-label={labels.next} onClick={() => step(1)}>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
        <h2 className="portfolio-display lab-gallery-title" aria-live="polite">{study.title}</h2>
        <details key={study.id} className="lab-gallery-prompt">
          <summary className="portfolio-mono">{labels.prompt}</summary>
          <p lang="en">{study.prompt}</p>
          <Button type="button" size="sm" className="min-h-11" onClick={copyPrompt}>
            <Copy aria-hidden="true" className="size-4" />
            {labels.copy}
          </Button>
          <p role="status" className="portfolio-mono">{feedback?.id === study.id ? labels[feedback.status] : ""}</p>
        </details>
      </div>
      <ul className="lab-gallery-strip">
        {studies.map((item, itemIndex) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={item.title}
              aria-pressed={itemIndex === index}
              onClick={() => {
                setFeedback(undefined);
                setIndex(itemIndex);
              }}
            >
              <Image src={imagePath(item.id)} alt="" fill sizes="(max-width: 760px) 18vw, 180px" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
