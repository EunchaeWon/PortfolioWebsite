"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  githubUrl: string;
  showWorldGuide?: boolean;
};

const internalLinks = [
  { label: "Projects", href: "/projects" },
  { label: "View World", href: "/world" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header({ githubUrl, showWorldGuide = false }: HeaderProps) {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    if (!showWorldGuide) return;
    const updatePosition = () => setIsAtTop(window.scrollY <= 2);
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, [showWorldGuide]);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  };

  return (
    <header className="site-header">
      <Link className="wordmark" href="/#top" aria-label="Eunchae Won, home">
        Eunchae Won / Home
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {internalLinks.map((link) => (
          <Link key={link.href} href={link.href} className={showWorldGuide && link.href === "/world" ? "project-guided-link" : undefined}>
            {link.label}
            {showWorldGuide && isAtTop && link.href === "/world" && (
              <span className="monitor-click-cursor header-project-guide" aria-hidden="true">
                <span>↗</span><small>Click</small>
              </span>
            )}
          </Link>
        ))}
        <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
      </nav>

      <details className="mobile-nav" ref={mobileMenuRef}>
        <summary>Menu <span aria-hidden="true">＋</span></summary>
        <nav aria-label="Mobile navigation">
          {internalLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMobileMenu}>{link.label}</Link>
          ))}
          <a href={githubUrl} target="_blank" rel="noreferrer" onClick={closeMobileMenu}>GitHub ↗</a>
        </nav>
      </details>
    </header>
  );
}
