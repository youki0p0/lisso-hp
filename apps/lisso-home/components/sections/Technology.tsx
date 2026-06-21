"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Button } from "@/components/ds/Button";
import { Stat } from "@/components/ds/Stat";
import { Divider } from "@/components/ds/Divider";
import { Section } from "@/components/kit/Section";
import { Icon } from "@/components/kit/Icon";

/** LISSO Home — Technology Division. Build. Secure. Improve. + track record. */

function Capability({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
    >
      <Icon name={icon} size={22} color="var(--blue-500)" strokeWidth={1.4} />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          fontWeight: 500,
        }}
      >
        {title}
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: "0.5rem",
        }}
      >
        {items.map((it) => (
          <li
            key={it}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Technology({
  onNavigate = () => {},
}: {
  onNavigate?: (key: string) => void;
}) {
  return (
    <Section
      id="technology"
      bg="var(--bg-section)"
      style={{ borderTop: "1px solid var(--border-hairline)" }}
    >
      <div style={{ maxWidth: "44rem" }}>
        <Eyebrow index="04">Technology Division</Eyebrow>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "var(--space-5) 0 var(--space-4)",
          }}
        >
          技術で、現場の摩擦を減らす。
        </h2>
        <div
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "var(--text-lg)",
            letterSpacing: "0.06em",
            color: "var(--text-accent)",
            marginBottom: "var(--space-5)",
          }}
        >
          Build. Secure. Improve.
        </div>
        <p
          style={{
            fontSize: "var(--text-md)",
            lineHeight: 1.95,
            color: "var(--text-secondary)",
          }}
        >
          インフラストラクチャ、サイバーセキュリティ、DX推進を中心に、設計・構築・運用まで支援します。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--space-7)",
          margin: "var(--space-9) 0",
        }}
      >
        <Capability
          icon="server"
          title="Infrastructure"
          items={[
            "AWS / Google Cloud",
            "Linux · Docker · Kubernetes",
            "CI/CD・監視運用",
            "クラウド移行",
          ]}
        />
        <Capability
          icon="shield"
          title="Security"
          items={[
            "クラウドセキュリティ強化",
            "ログ・監視基盤",
            "IAM / 権限設計",
            "PCIDSS 関連保守",
          ]}
        />
        <Capability
          icon="trending-up"
          title="DX"
          items={["システム刷新", "業務プロセス改善", "自動化", "Web アプリ開発"]}
        />
      </div>

      <Divider label="Track record" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-6)",
          margin: "var(--space-7) 0",
        }}
      >
        <Stat value="3" suffix="yrs" label="Telecom core systems" />
        <Stat value="13" label="System renewals" />
        <Stat value="2" suffix="yrs" label="DX promotion" />
        <Stat value="2" label="Cloud · Security domains" />
      </div>

      <Button
        variant="secondary"
        onClick={() => onNavigate("contact")}
        iconRight={<Icon name="arrow-right" size={15} />}
      >
        技術支援を相談する
      </Button>
    </Section>
  );
}
