import React from "react";

/**
 * LISSO VectorBar — a single sensory dimension rendered as a thin track with
 * an olive fill, value shown in mono. The atomic unit of ShishaOS taste
 * vectors (sweetness, acidity, cooling…) — olive marks the Shisha side.
 * Scale defaults to 0–10. Pass `color` to override the fill.
 */
export type VectorBarProps = {
  label: React.ReactNode;
  value: number;
  max?: number;
  color?: string;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function VectorBar({
  label,
  value,
  max = 10,
  color = "var(--accent-2)",
  style = {},
  ...rest
}: VectorBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "8.5rem 1fr 2.2rem",
        alignItems: "center",
        gap: "1rem",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "relative",
          height: "3px",
          background: "var(--ink-700)",
          borderRadius: "var(--radius-pill)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            background: color,
            borderRadius: "var(--radius-pill)",
          }}
        />
      </span>
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "var(--text-xs)",
          color: "var(--text-tertiary)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}
