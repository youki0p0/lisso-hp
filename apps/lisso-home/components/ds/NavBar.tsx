"use client";

import React from "react";
import { Logo } from "./Logo";

/**
 * LISSO NavBar — the corporate global navigation. Logo left, quiet
 * letterspaced links, a single accent contact action. Transparent over hero,
 * hairline divider at the base. Pass the active route key to highlight it.
 */
export type NavLink = { key: string; label: string; jp: string };

const DEFAULT_LINKS: NavLink[] = [
  { key: "home", label: "Home", jp: "ホーム" },
  { key: "shisha", label: "Shisha", jp: "シーシャ" },
  { key: "flavor-os", label: "Flavor OS", jp: "フレーバーOS" },
  { key: "shop", label: "Shop", jp: "ショップ" },
  { key: "technology", label: "Technology", jp: "技術" },
  { key: "company", label: "Company", jp: "会社" },
];

export type NavBarProps = {
  active?: string;
  links?: NavLink[];
  onNavigate?: (key: string) => void;
  style?: React.CSSProperties;
};

export function NavBar({
  active = "home",
  links = DEFAULT_LINKS,
  onNavigate = () => {},
  style = {},
}: NavBarProps) {
  return (
    <nav
      className="lisso-nav"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-6)",
        padding: "1.25rem var(--space-7)",
        borderBottom: "1px solid var(--border-hairline)",
        background: "color-mix(in oklab, var(--bg-page) 72%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      <button
        onClick={() => onNavigate("home")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="LISSO home"
      >
        <Logo size={19} />
      </button>

      <ul
        className="lisso-nav-links"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-6)",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {links.map((l) => (
          <li key={l.key}>
            <button
              onClick={() => onNavigate(l.key)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem 0",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                letterSpacing: "0.04em",
                color:
                  active === l.key
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                borderBottom:
                  active === l.key
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                transition: "color var(--dur-fast) var(--ease-standard)",
              }}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onNavigate("contact")}
        className="lisso-button"
        data-variant="primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)" as unknown as number,
          padding: "0.55rem 1.2rem",
          color: "var(--text-on-accent)",
          background: "var(--accent)",
          border: "1px solid var(--accent)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
      >
        Contact
      </button>
    </nav>
  );
}
