import React from "react";

/**
 * LISSO Card — a restrained surface. The brand avoids heavy cards, so the
 * default is borderless with a subtle elevated background; use `bordered`
 * for a hairline edge and `interactive` for hover lift on clickable cards.
 */
export type CardProps = {
  children?: React.ReactNode;
  bordered?: boolean;
  interactive?: boolean;
  inset?: boolean;
  padding?: string;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Card({
  children,
  bordered = false,
  interactive = false,
  inset = false,
  padding = "var(--space-6)",
  style = {},
  ...rest
}: CardProps) {
  return (
    <div
      className="lisso-card"
      data-interactive={interactive ? "true" : "false"}
      style={{
        background: inset ? "var(--surface-inset)" : "var(--surface-card)",
        border: bordered
          ? "1px solid var(--border-hairline)"
          : "1px solid transparent",
        borderRadius: "var(--radius-md)",
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
