import React from "react";

/**
 * Plain-background product-photo placeholder. Texture-forward, quiet.
 * Drop a real image in by replacing this panel where used.
 */
export type PhotoProps = {
  ratio?: string;
  label?: string;
  tone?: "ink" | "deep" | "paper";
  caption?: React.ReactNode;
  style?: React.CSSProperties;
};

export function Photo({
  ratio = "4 / 3",
  label = "Product photography",
  tone = "ink",
  caption = null,
  style = {},
}: PhotoProps) {
  const tones = {
    ink: {
      bg: "var(--ink-850)",
      fg: "var(--stone-500)",
      grad: "radial-gradient(120% 90% at 30% 20%, rgba(60,101,146,0.06), transparent 60%)",
    },
    deep: {
      bg: "var(--ink-950)",
      fg: "var(--stone-600)",
      grad: "radial-gradient(120% 90% at 70% 30%, rgba(60,101,146,0.05), transparent 55%)",
    },
    paper: {
      bg: "var(--paper-100)",
      fg: "var(--stone-500)",
      grad: "radial-gradient(120% 90% at 30% 20%, rgba(0,0,0,0.04), transparent 60%)",
    },
  } as const;
  const t = tones[tone] || tones.ink;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        background: t.bg,
        backgroundImage: t.grad,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.fg,
        }}
      >
        {label}
      </span>
      {caption && (
        <span
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
