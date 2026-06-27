"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Button } from "@/components/ds/Button";
import { Section } from "@/components/kit/Section";
import { Photo } from "@/components/kit/Photo";
import { Icon } from "@/components/kit/Icon";
import { SHISHAOS_URL } from "@/lib/links";

/** LISSO Home — Shisha Division: real shop (Shisha Shop & Cafe Lisso). */
export function Shisha() {
  const feed = [
    "新作 Mix",
    "店内のしつらえ",
    "入荷フレーバー",
    "季節の構成",
    "余韻の設計",
    "営業案内",
  ];
  return (
    <Section
      id="shisha"
      bg="linear-gradient(rgba(10,11,13,0.78), rgba(10,11,13,0.86)), url('/assets/texture-chalkboard.png') center/cover"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-9)",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              marginBottom: "var(--space-5)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/lisso-shisha-mark.png"
              alt="Lisso shisha mark"
              width="46"
              height="46"
              style={{ opacity: 0.95 }}
            />
            <Eyebrow index="01" style={{ color: "var(--text-accent-2)" }}>
              Shisha Shop &amp; Cafe Lisso
            </Eyebrow>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: "0 0 var(--space-5)",
            }}
          >
            理論で味を
            <br />
            設計する、小さな店。
          </h2>
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: 1.95,
              color: "var(--text-secondary)",
              maxWidth: "30rem",
            }}
          >
            シーシャを「吸う料理」として捉えるシーシャショップ＆カフェ。
            香り・甘味・酸味・塩味・余韻のバランスを設計し、初めての方にも分かる味を提案します。
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-7)",
              margin: "var(--space-6) 0",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Access
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  marginTop: 8,
                  lineHeight: 1.8,
                  color: "var(--text-secondary)",
                }}
              >
                〒174-0076
                <br />
                東京都板橋区上板橋2丁目30-7
                <br />
                あやめマンション104号
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                For
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  marginTop: 8,
                  lineHeight: 1.8,
                  color: "var(--text-secondary)",
                }}
              >
                20歳以上
                <br />
                カフェ好き・理論派
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            as="a"
            href={SHISHAOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            iconRight={<Icon name="external-link" size={15} />}
          >
            ShishaOS でレシピを見る
          </Button>
        </div>

        <div
          style={{
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            backgroundColor: "var(--paper-50)",
            backgroundImage: "url('/assets/texture-pastel.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: "4 / 5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/product-shisha-pod.png"
            alt="Lisso POD shisha"
            style={{
              width: "90%",
              height: "auto",
              objectFit: "contain",
              mixBlendMode: "multiply",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 16,
              bottom: 14,
              fontFamily: "var(--font-data)",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--stone-500)",
            }}
          >
            POD · 無地背景
          </span>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-9)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-5)",
          }}
        >
          <a
            className="lisso-link"
            href="https://www.instagram.com/shisha.cafe.lisso/"
            target="_blank"
            rel="noopener"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: "var(--text-secondary)",
            }}
          >
            <Icon name="instagram" size={18} color="var(--olive-400)" />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "13px",
                letterSpacing: "0.08em",
              }}
            >
              @shisha.cafe.lisso
            </span>
          </a>
          <a
            className="lisso-link"
            href="https://www.instagram.com/shisha.cafe.lisso/"
            target="_blank"
            rel="noopener"
            style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
          >
            Instagram でフォロー
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "var(--space-3)",
          }}
        >
          {feed.map((c, i) => (
            <Photo key={i} ratio="1 / 1" tone={i % 2 ? "deep" : "ink"} label={c} />
          ))}
        </div>
      </div>
    </Section>
  );
}
