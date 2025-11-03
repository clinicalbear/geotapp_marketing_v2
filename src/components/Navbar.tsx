"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Funzionalità", href: "#features" },
  { label: "Per chi", href: "#target" },
  { label: "Prezzi", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contatti", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="container nav-container">
        <Link href="#home" className="logo" onClick={() => setOpen(false)}>
          GeoTapp
        </Link>

        <nav className="nav-list" aria-label="Navigazione principale">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="nav-btn" href="mailto:info@geotapp.com">
            Scrivici
          </a>
          <a className="nav-btn primary" href="#pricing">
            Scopri i piani
          </a>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Apri menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      <div className={`mobile-panel ${open ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <a className="nav-btn" href="mailto:info@geotapp.com" onClick={() => setOpen(false)}>
          Scrivici
        </a>
        <a className="nav-btn primary" href="#pricing" onClick={() => setOpen(false)}>
          Scopri i piani
        </a>
      </div>
    </header>
  );
}
