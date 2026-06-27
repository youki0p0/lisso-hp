import React from "react";

/**
 * LISSO Stat — a large serif figure over a mono caption. Used for the
 * Technology division's track record (3 years, 13 projects) and ShishaOS
 * metrics. Numbers are the protagonist; labels stay quiet.
 */
export type StatProps = {
  value: React.ReactNode;
  label: React.ReactNode;
  suffix?: React.ReactNode;
  align?: "left" | "center";
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Stat({
  value,
  label,
  suffix = null,
  align = "left",
  style = {},
  ...rest
}: StatProps) {
  return (
    <div style={{ textAlign: align, ...style }} {...rest}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          fontWeight: "var(--weight-medium)" as unknown as number,
          lineHeight: 1,
          letterSpacing: "var(--tracking-tight)",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "baseline",
          gap: "0.2rem",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {value}
        {suffix && (
          <span style={{ fontSize: "var(--text-lg)", color: "var(--text-accent)" }}>
            {suffix}
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: "0.7rem",
          fontFamily: "var(--font-data)",
          fontSize: "var(--text-xs)",
          letterSpacing: "var(--tracking-wide)",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
