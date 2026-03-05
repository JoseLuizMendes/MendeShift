"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { id: "hero", label: "Início" },
  { id: "signals", label: "Sinais" },
  { id: "work", label: "Experimentos" },
  { id: "principles", label: "Princípios" },
  { id: "colophon", label: "Contato" },
];

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.45 },
    );

    for (const { id } of navItems) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed left-0 top-0 z-50 hidden h-screen w-14 flex-col justify-center border-r border-border/30 bg-background/80 backdrop-blur-sm md:flex md:w-16">
      <div className="flex flex-col gap-6 px-4">
        {navItems.map(({ id, label }) => {
          const active = activeSection === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              aria-current={active ? "true" : undefined}
              className="group relative flex items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  active
                    ? "scale-125 bg-accent"
                    : "bg-muted-foreground/40 group-hover:bg-foreground/60",
                )}
              />
              <span
                className={cn(
                  "absolute left-5 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200",
                  "group-hover:left-7 group-hover:opacity-100",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
