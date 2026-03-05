"use client";

import { useEffect, useRef } from "react";

interface AnimatedNoiseProps {
  opacity?: number;
  className?: string;
}

export function AnimatedNoise({ opacity = 0.04, className }: AnimatedNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let frame = 0;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth / 2));
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight / 2));
    };

    const renderNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      frame += 1;
      if (frame % 2 === 0) renderNoise();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
      }}
      aria-hidden="true"
    />
  );
}
