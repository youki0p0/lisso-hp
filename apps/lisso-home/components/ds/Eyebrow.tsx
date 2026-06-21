import React from "react";

/**
 * LISSO Eyebrow — the mono, letterspaced kicker that sits above headings
 * across the brand (e.g. "SHISHA DIVISION", "FLAVOR OS"). Often paired with
 * a leading index number like "01 /". This is a core brand signature.
 */
export type EyebrowProps = {
  children?: React.ReactNode;
  index?: React.ReactNode;
  tone?: "accent" | "muted";
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Eyebrow({
  children,
  index = null,
  tone = "accent",
  style = {},
  ...rest
}: EyebrowProps) {
  const color = tone === "accent" ? "var(--text-accent)" : "var(--text-tertiary)";
  return (
    <span
      className="lisso-eyebrow"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        fontFamily: "var(--font-data)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)" as unknown as number,
        letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
      {...rest}
    >
      {index != null && (
        <>
          <span style={{ color: "var(--text-tertiary)" }}>{index}</span>
          <span
            aria-hidden="true"
            style={{
              width: "1.6rem",
              height: "1px",
              background: "var(--border-strong)",
            }}
          />
        </>
      )}
      {children}
    </span>
  );
}
