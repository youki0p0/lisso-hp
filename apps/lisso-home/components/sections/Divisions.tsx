"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Tag } from "@/components/ds/Tag";
import { Icon } from "@/components/kit/Icon";

/** LISSO Home — Two Divisions. Shisha | Technology, clearly split. */

type PanelProps = {
  index: string;
  kicker: string;
  title: string;
  jp: string;
  desc: string;
  tags: string[];
  route: string;
  onNavigate: (key: string) => void;
  tint?: string;
};

function DivisionPanel({
  index,
  kicker,
  title,
  jp,
  desc,
  tags,
  route,
  onNavigate,
  tint = "var(--text-accent)",
}: PanelProps) {
  return (
    <button
      onClick={() => onNavigate(route)}
      style={{
        textAlign: "left",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "var(--space-8) var(--space-7)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        minHeight: "26rem",
        transition: "background var(--dur-base) var(--ease-standard)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          "color-mix(in oklab, var(--paper-50) 3%, transparent)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Eyebrow index={index} style={{ color: tint }}>
        {kicker}
      </Eyebrow>
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-md)",
            color: tint,
            marginTop: "var(--space-3)",
          }}
        >
          {jp}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            lineHeight: 1.9,
            color: "var(--text-secondary)",
            marginTop: "var(--space-4)",
            maxWidth: "26rem",
          }}
        >
          {desc}
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-primary)",
          fontSize: "var(--text-sm)",
          marginTop: "var(--space-2)",
        }}
      >
        詳しく見る <Icon name="arrow-right" size={15} color={tint} />
      </div>
    </button>
  );
}

export function Divisions({
  onNavigate = () => {},
}: {
  onNavigate?: (key: string) => void;
}) {
  return (
    <section
      style={{
        background: "var(--bg-section)",
        borderTop: "1px solid var(--border-hairline)",
        borderBottom: "1px solid var(--border-hairline)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw-wide)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
        }}
      >
        <DivisionPanel
          index="01"
          kicker="Shisha Division"
          title="Shisha"
          jp="吸う料理 — smokable gastronomy"
          desc="甘味・酸味・清涼・塩味・余韻・温度変化まで設計する、理論のシーシャ。実店舗カフェと味覚共有OS「ShishaOS」。"
          tags={["Aroma", "Mixology", "Gastronomy", "ShishaOS"]}
          route="shisha"
          onNavigate={onNavigate}
          tint="var(--text-accent-2)"
        />
        <div style={{ background: "var(--border-hairline)" }} />
        <DivisionPanel
          index="02"
          kicker="Technology Division"
          title="Technology"
          jp="技術で、現場の摩擦を減らす"
          desc="インフラストラクチャ、サイバーセキュリティ、DX推進を、設計から構築・運用まで。Build. Secure. Improve."
          tags={["Infrastructure", "Security", "DX", "Cloud"]}
          route="technology"
          onNavigate={onNavigate}
          tint="var(--text-accent)"
        />
      </div>
    </section>
  );
}
