"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/inventory", label: "在庫" },
  { href: "/orders", label: "発注履歴" },
  { href: "/recommend", label: "発注提案" },
];

export function Nav() {
  const path = usePathname();
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span className="brand">🐲 MONSTER 発注</span>
        <nav className="nav">
          {ITEMS.map((it) => {
            const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} className={active ? "active" : ""}>
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
