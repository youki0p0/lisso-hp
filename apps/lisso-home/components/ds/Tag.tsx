import React from "react";

/**
 * LISSO Tag — small letterspaced label. Used for flavor roles, division
 * markers, categories. Default is a quiet hairline pill; `tone="accent"`
 * tints it with the accent. Keep these sparse — they are labels, not decoration.
 */
export type TagProps = {
  children?: React.ReactNode;
  tone?: "neutral" | "accent" | "solid";
  mono?: boolean;
  interactive?: boolean;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Tag({
  children,
  tone = "neutral",
  mono = false,
  interactive = false,
  style = {},
  ...rest
}: TagProps) {
  const tones: Record<string, React.CSSProperties> = {
    neutral: {
      color: "var(--text-secondary)",
      border: "1px solid var(--border-hairline)",
      background: "transparent",
    },
    accent: {
      color: "var(--text-accent)",
      border: "1px solid var(--border-accent)",
      background: "var(--accent-soft)",
    },
    solid: {
      color: "var(--text-on-accent)",
      border: "1px solid var(--accent)",
      background: "var(--accent)",
    },
  };

  return (
    <span
      className="lisso-tag"
      data-interactive={interactive ? "true" : "false"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontFamily: mono ? "var(--font-data)" : "var(--font-body)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-medium)" as unknown as number,
        letterSpacing: mono ? "var(--tracking-wide)" : "0.04em",
        textTransform: mono ? "uppercase" : "none",
        lineHeight: 1,
        padding: "0.38rem 0.7rem",
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
        transition:
          "border-color var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
