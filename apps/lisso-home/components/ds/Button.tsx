"use client";

import React from "react";

/**
 * LISSO Button — quiet, typographic, sharp-cornered.
 * Variants: primary (metallic-blue fill), secondary (hairline outline),
 * ghost (text only). The accent is used sparingly — prefer secondary/ghost
 * in dense areas and reserve primary for the single key action on a view.
 */
export type ButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: React.ElementType;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  as = "button",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  style = {},
  ...rest
}: ButtonProps) {
  const sizes = {
    sm: { padding: "0.5rem 0.95rem", fontSize: "var(--text-sm)", gap: "0.5rem" },
    md: { padding: "0.7rem 1.3rem", fontSize: "var(--text-base)", gap: "0.6rem" },
    lg: { padding: "0.95rem 1.9rem", fontSize: "var(--text-md)", gap: "0.7rem" },
  } as const;

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      border: "1px solid var(--accent)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid transparent",
    },
  };

  const base: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes[size].gap,
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-medium)" as unknown as number,
    letterSpacing: "0.02em",
    lineHeight: 1,
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition:
      "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
    padding: sizes[size].padding,
    fontSize: sizes[size].fontSize,
    ...variants[variant],
    ...style,
  };

  const Comp = as;
  return (
    <Comp
      className="lisso-button"
      data-variant={variant}
      disabled={as === "button" ? disabled : undefined}
      style={base}
      {...rest}
    >
      {iconLeft}
      {children != null && <span>{children}</span>}
      {iconRight}
    </Comp>
  );
}
