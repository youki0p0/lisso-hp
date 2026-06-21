"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Button } from "@/components/ds/Button";
import { Tag } from "@/components/ds/Tag";
import { Section } from "@/components/kit/Section";
import { Photo } from "@/components/kit/Photo";
import { Icon } from "@/components/kit/Icon";

/* LISSO Home — Shop. BASE-style EC storefront (lisso.base.shop), Shisha-side
   so accented olive. Filter chips + fake add-to-cart. */

type Product = {
  id: string;
  n: string;
  cat: string;
  catLabel: string;
  p: number;
  img?: string;
  stock: boolean;
};

const SHOP_PRODUCTS: Product[] = [
  {
    id: "pod",
    n: "LISSO POD Device",
    cat: "device",
    catLabel: "Device",
    p: 14800,
    img: "/assets/product-shisha-pod.png",
    stock: true,
  },
  { id: "peach", n: "BLACKBURN — Peach Yogurt", cat: "flavor", catLabel: "Dessert", p: 1800, stock: true },
  { id: "white", n: "White Tea", cat: "flavor", catLabel: "Connector", p: 1600, stock: true },
  { id: "olive", n: "Olive", cat: "flavor", catLabel: "Structural", p: 1600, stock: false },
  { id: "starter", n: "LISSO Starter Set", cat: "set", catLabel: "Set", p: 6800, stock: true },
  { id: "hmd", n: "HMD / Bowl", cat: "device", catLabel: "Heat", p: 3200, stock: true },
];
const FILTERS = [
  { k: "all", label: "すべて" },
  { k: "flavor", label: "フレーバー" },
  { k: "device", label: "デバイス" },
  { k: "set", label: "セット" },
];
const yen = (n: number) => "¥" + n.toLocaleString("ja-JP");

function ProductCard({ pr, onAdd }: { pr: Product; onAdd: () => void }) {
  const [added, setAdded] = React.useState(false);
  const add = () => {
    if (!pr.stock) return;
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        {pr.img ? (
          <div
            style={{
              aspectRatio: "1 / 1",
              backgroundColor: "var(--paper-50)",
              backgroundImage: "url('/assets/texture-pastel.png')",
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pr.img}
              alt={pr.n}
              style={{ width: "82%", mixBlendMode: "multiply" }}
            />
          </div>
        ) : (
          <Photo ratio="1 / 1" tone="deep" label={pr.catLabel} />
        )}
        {!pr.stock && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              fontFamily: "var(--font-data)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--paper-50)",
              background: "rgba(8,9,11,0.72)",
              padding: "4px 8px",
              borderRadius: "var(--radius-xs)",
            }}
          >
            Sold out
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "var(--space-3)",
        }}
      >
        <Tag>{pr.catLabel}</Tag>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          {yen(pr.p)}
        </span>
      </div>
      <div
        style={{
          fontSize: "var(--text-base)",
          margin: "var(--space-2) 0 var(--space-4)",
          color: "var(--text-primary)",
        }}
      >
        {pr.n}
      </div>
      <button
        onClick={add}
        disabled={!pr.stock}
        className="lisso-button"
        data-variant={pr.stock ? "primary" : "ghost"}
        style={{
          marginTop: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          padding: "0.6rem 1rem",
          borderRadius: "var(--radius-sm)",
          cursor: pr.stock ? "pointer" : "not-allowed",
          color: pr.stock ? "var(--text-on-accent)" : "var(--text-tertiary)",
          background: pr.stock
            ? added
              ? "var(--accent-press)"
              : "var(--accent)"
            : "transparent",
          border: pr.stock
            ? "1px solid var(--accent)"
            : "1px solid var(--border-hairline)",
        }}
      >
        {pr.stock
          ? added
            ? "✓ 追加しました"
            : "カートに入れる"
          : "再入荷をお待ちください"}
      </button>
    </div>
  );
}

const OLIVE_SCOPE = {
  "--accent": "var(--olive-500)",
  "--accent-hover": "var(--olive-400)",
  "--accent-press": "var(--olive-600)",
  "--accent-soft": "color-mix(in oklab, var(--olive-500) 16%, transparent)",
  "--text-accent": "var(--olive-300)",
  "--text-on-accent": "var(--ink-950)",
  "--border-accent": "var(--olive-600)",
} as React.CSSProperties;

export function Shop({
  onNavigate = () => {},
}: {
  onNavigate?: (key: string) => void;
}) {
  const [filter, setFilter] = React.useState("all");
  const [cart, setCart] = React.useState(0);
  const shown = SHOP_PRODUCTS.filter((p) => filter === "all" || p.cat === filter);

  return (
    <Section
      id="shop"
      bg="var(--bg-section)"
      style={{
        borderTop: "1px solid var(--border-hairline)",
        ...OLIVE_SCOPE,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-5)",
          marginBottom: "var(--space-6)",
        }}
      >
        <div>
          <Eyebrow index="02" style={{ color: "var(--text-accent-2)" }}>
            Shop
          </Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 500,
              marginTop: "var(--space-4)",
            }}
          >
            フレーバーと道具を、設計図とともに。
          </h2>
        </div>
        <Button
          variant="secondary"
          as="a"
          href="https://lisso.base.shop/"
          iconRight={<Icon name="external-link" size={14} />}
        >
          lisso.base.shop
        </Button>
      </div>

      {/* Storefront panel */}
      <div
        style={{
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--bg-elevated)",
        }}
      >
        {/* store header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            padding: "var(--space-4) var(--space-6)",
            borderBottom: "1px solid var(--border-hairline)",
            background: "var(--bg-sunken)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lisso-shisha-mark.png" alt="" width="26" height="26" />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
              }}
            >
              Shisha Shop &amp; Cafe Lisso · Store
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.4rem 0.8rem",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <Icon name="shopping-bag" size={15} color="var(--text-accent)" />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 12,
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {cart}
            </span>
          </div>
        </div>

        {/* filter chips */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            padding: "var(--space-4) var(--space-6)",
            borderBottom: "1px solid var(--border-hairline)",
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => {
            const on = filter === f.k;
            return (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  background: on ? "var(--accent-soft)" : "transparent",
                  border: on
                    ? "1px solid var(--border-accent)"
                    : "1px solid var(--border-hairline)",
                  color: on ? "var(--text-accent)" : "var(--text-secondary)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-6)",
            padding: "var(--space-6)",
          }}
        >
          {shown.map((pr) => (
            <ProductCard key={pr.id} pr={pr} onAdd={() => setCart((c) => c + 1)} />
          ))}
        </div>

        {/* store footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-4) var(--space-6)",
            borderTop: "1px solid var(--border-hairline)",
            background: "var(--bg-sunken)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
            }}
          >
            Powered by BASE · lisso.base.shop
          </span>
          <a
            className="lisso-link"
            href="https://lisso.base.shop/"
            target="_blank"
            rel="noopener"
            style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
          >
            ストアを開く
          </a>
        </div>
      </div>

      <p
        style={{
          marginTop: "var(--space-5)",
          fontFamily: "var(--font-data)",
          fontSize: 12,
          letterSpacing: "0.04em",
          color: "var(--text-tertiary)",
        }}
      >
        ※ ストアは準備中。商品・価格は仮置きです。Flavor OS
        の購入提案と在庫連携予定。20歳以上対象。
      </p>
    </Section>
  );
}
