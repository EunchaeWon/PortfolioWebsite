"use client";

import Link from "next/link";
import { useRef } from "react";

type HeaderProps = {
  githubUrl: string;
};

const internalLinks = [
  { label: "Projects", href: "/projects" },
  { label: "View World", href: "/world" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header({ githubUrl }: HeaderProps) {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

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
          <Link key={link.href} href={link.href}>{link.label}</Link>
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
