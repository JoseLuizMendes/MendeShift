"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export function PortfolioMobileMenu({ title, closeLabel, children }: {
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(width > 820px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function closeOnNavigation(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a[href]")) {
      dialogRef.current?.close();
    }
  }

  return (
    <div className="portfolio-mobile-navigation">
      <button type="button" className="portfolio-menu-toggle" aria-label="Menu" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
        <Menu size={18} aria-hidden="true" />
      </button>
      <dialog ref={dialogRef} className="portfolio-mobile-menu" aria-label={title} data-lenis-prevent>
        <div className="portfolio-mobile-menu-top">
          <p className="portfolio-brand font-display">MendeShift<span className="text-accent">.</span></p>
          <button type="button" className="portfolio-menu-toggle" aria-label={closeLabel} onClick={() => dialogRef.current?.close()}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <nav className="portfolio-mobile-menu-links" aria-label={title} onClick={closeOnNavigation}>
          {children}
        </nav>
      </dialog>
    </div>
  );
}
