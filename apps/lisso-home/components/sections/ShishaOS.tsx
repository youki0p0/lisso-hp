"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Button } from "@/components/ds/Button";
import { Tag } from "@/components/ds/Tag";
import { VectorBar } from "@/components/ds/VectorBar";
import { Card } from "@/components/ds/Card";
import { Section } from "@/components/kit/Section";
import { Icon } from "@/components/kit/Icon";
import { SHISHAOS_URL } from "@/lib/links";

/** LISSO Home — ShishaOS. Inventory → Mix → Share, with a taste profile. */

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-4)" }}>
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "13px",
          color: "var(--text-accent)",
          paddingTop: 2,
        }}
      >
        {n}
      </span>
      <div>
        <div style={{ fontSize: "var(--text-base)", color: "var(--text-primary)" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            marginTop: 4,
            lineHeight: 1.8,
          }}
        >
          {desc}
        </div>
      </div>
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

export function ShishaOS() {
  return (
    <Section id="shisha-os" bg="var(--bg-page)" style={OLIVE_SCOPE}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-9)",
          alignItems: "center",
        }}
      >
        <div>
          <Eyebrow index="03" style={{ color: "var(--text-accent-2)" }}>
            ShishaOS
          </Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: "var(--space-5) 0 var(--space-5)",
            }}
          >
            味覚を、共有するOS。
          </h2>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: 1.95,
              color: "var(--text-secondary)",
              maxWidth: "30rem",
              marginBottom: "var(--space-7)",
            }}
          >
            手持ちのフレーバー在庫から Mix
            を提案し、他人のレシピを自分の在庫で再現する、シーシャ味覚共有アプリ。
          </p>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              marginBottom: "var(--space-7)",
            }}
          >
            <Step n="01" title="在庫を登録" desc="手持ちのフレーバーを記録する。" />
            <Step n="02" title="Mix を提案" desc="LISSO の理論で在庫から構成を生成。" />
            <Step
              n="03"
              title="再現・購入提案"
              desc="他人のレシピを自分の在庫で再構成。欠けは購入提案で補う。"
            />
          </div>
          <Button
            variant="primary"
            as="a"
            href={SHISHAOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            iconRight={<Icon name="external-link" size={15} />}
          >
            ShishaOS を体験
          </Button>
        </div>

        <Card bordered padding="var(--space-7)">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
              }}
            >
              Peach Yogurt × Lemon
            </div>
            <Tag tone="accent" mono>
              Human verified
            </Tag>
          </div>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <VectorBar label="Sweetness" value={8.5} />
            <VectorBar label="Acidity" value={4.5} />
            <VectorBar label="Creaminess" value={7.5} />
            <VectorBar label="Cooling" value={1.0} />
            <VectorBar label="Aftertaste" value={6.0} />
          </div>
          <div
            style={{
              marginTop: "var(--space-5)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--border-hairline)",
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            <Tag>Dessert base</Tag>
            <Tag>Sweet body</Tag>
            <Tag>Beginner friendly</Tag>
          </div>
        </Card>
      </div>
    </Section>
  );
}
