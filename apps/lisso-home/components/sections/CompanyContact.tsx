"use client";

import React from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Button } from "@/components/ds/Button";
import { Input } from "@/components/ds/Input";
import { Logo } from "@/components/ds/Logo";
import { Section } from "@/components/kit/Section";
import { Icon } from "@/components/kit/Icon";

/** LISSO Home — Company + Contact + Footer. */

function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  if (submitted) {
    return (
      <div
        style={{
          border: "1px solid var(--border-accent)",
          background: "var(--accent-soft)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-7)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid var(--border-accent)",
            marginBottom: "var(--space-5)",
          }}
        >
          <Icon name="check" size={20} color="var(--text-accent)" />
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            marginBottom: "var(--space-3)",
          }}
        >
          送信しました。
        </h3>
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            lineHeight: 1.9,
            marginBottom: "var(--space-6)",
          }}
        >
          ご相談ありがとうございます。内容を確認のうえ、数日内にご返信します。
        </p>
        <Button
          variant="ghost"
          onClick={() => setSubmitted(false)}
          iconLeft={<Icon name="arrow-left" size={15} />}
        >
          別の相談を送る
        </Button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      style={{ display: "grid", gap: "var(--space-5)" }}
    >
      <Input label="お名前" placeholder="山田 太郎" required />
      <Input label="Email" type="email" placeholder="you@example.com" required />
      <Input label="ご相談" placeholder="Shisha / Technology のどちらでも" required />
      <Button
        variant="primary"
        type="submit"
        iconRight={<Icon name="arrow-right" size={15} />}
      >
        送信する
      </Button>
      <p
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          color: "var(--text-tertiary)",
          letterSpacing: "0.04em",
        }}
      >
        ※
        健康効能の訴求は行いません。20歳未満のシーシャ利用はできません。
      </p>
    </form>
  );
}

export function CompanyContact() {
  const rows: [string, string][] = [
    ["商号", "合同会社 LISSO"],
    ["事業", "Shisha Division / Technology Division"],
    ["店舗", "Shisha Shop & Cafe Lisso"],
    ["所在", "〒174-0076 東京都板橋区上板橋2-30-7 あやめマンション104"],
    ["Instagram", "@shisha.cafe.lisso"],
    ["対象", "20歳以上"],
  ];
  return (
    <Section id="company" bg="var(--bg-page)">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-9)",
        }}
      >
        <div>
          <Eyebrow index="05">Company</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 500,
              margin: "var(--space-5) 0 var(--space-6)",
            }}
          >
            体験を設計する会社。
          </h2>
          <div style={{ display: "grid", gap: 0 }}>
            {rows.map(([k, v], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "8rem 1fr",
                  gap: "var(--space-4)",
                  padding: "var(--space-4) 0",
                  borderBottom: "1px solid var(--border-hairline)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div id="contact">
          <Eyebrow index="06">Contact</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 500,
              margin: "var(--space-5) 0 var(--space-6)",
            }}
          >
            設計の相談を、静かに。
          </h2>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}

export function Footer({
  onNavigate = () => {},
}: {
  onNavigate?: (key: string) => void;
}) {
  const links = ["Shisha", "ShishaOS", "Shop", "Technology", "Company", "Contact"];
  return (
    <footer
      style={{
        background: "var(--bg-sunken)",
        borderTop: "1px solid var(--border-hairline)",
        padding: "var(--space-8) var(--gutter) var(--space-7)",
      }}
    >
      <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-6)",
            alignItems: "flex-start",
          }}
        >
          <div>
            <Logo size={20} />
            <p
              style={{
                marginTop: "var(--space-4)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
                maxWidth: "22rem",
                lineHeight: 1.8,
              }}
            >
              香りを設計する。インフラを設計する。体験を設計する。
            </p>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                letterSpacing: "0.04em",
                color: "var(--text-tertiary)",
                lineHeight: 1.9,
              }}
            >
              Shisha Shop &amp; Cafe Lisso
              <br />
              〒174-0076 東京都板橋区上板橋2-30-7 あやめマンション104
              <br />
              Instagram @shisha.cafe.lisso
            </p>
          </div>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-5)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(l.toLowerCase().replace(" ", "-"));
                  }}
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                  }}
                  className="lisso-link"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            marginTop: "var(--space-7)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--border-hairline)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--text-tertiary)",
            }}
          >
            © 2026 合同会社 LISSO
          </span>
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            For 20+ · Drink responsibly
          </span>
        </div>
      </div>
    </footer>
  );
}
