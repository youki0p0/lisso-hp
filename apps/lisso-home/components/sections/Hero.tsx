"use client";

import React from "react";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/kit/Icon";

/** LISSO Home — Hero. 「香りを、設計する。」 + the two-division promise. */
export function Hero({
  onNavigate = () => {},
}: {
  onNavigate?: (key: string) => void;
}) {
  return (
    <section
      className="lz-hero"
      style={{
        position: "relative",
        minHeight: "82vh",
        display: "flex",
        alignItems: "center",
        padding: "var(--space-10) var(--gutter) var(--space-9)",
        overflow: "hidden",
        background:
          "radial-gradient(80% 120% at 85% 0%, rgba(60,101,146,0.10), transparent 55%), var(--bg-page)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw-content)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "52rem" }}>
          <Eyebrow index="—">合同会社 LISSO</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: "var(--space-6) 0 var(--space-5)",
            }}
          >
            香りを、
            <br />
            設計する。
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
              lineHeight: 1.9,
              color: "var(--text-secondary)",
              maxWidth: "38rem",
            }}
          >
            シーシャの味覚設計と、インフラ・セキュリティ・DX の技術支援。 LISSO
            は、理論と精度で
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              体験を設計する
            </strong>
            会社です。
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
              marginTop: "var(--space-7)",
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate("shisha")}
              iconRight={<Icon name="arrow-right" size={17} />}
            >
              Shisha を見る
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate("technology")}
            >
              Technology を見る
            </Button>
          </div>
        </div>
      </div>

      <div
        className="lz-hero-tag"
        style={{
          position: "absolute",
          bottom: "var(--space-6)",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          whiteSpace: "nowrap",
        }}
      >
        Design aroma · Design infrastructure · Design experience
      </div>
    </section>
  );
}
