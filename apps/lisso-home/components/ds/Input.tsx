import React from "react";

/**
 * LISSO Input — a quiet field. Bottom-line by default (calm, editorial);
 * `boxed` gives a full hairline box for forms. Pairs with a small label.
 */
export type InputProps = {
  label?: React.ReactNode;
  variant?: "line" | "boxed";
  type?: string;
  id?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Input({
  label = null,
  variant = "line",
  type = "text",
  id,
  style = {},
  containerStyle = {},
  ...rest
}: InputProps) {
  const line: React.CSSProperties = {
    border: "none",
    borderBottom: "1px solid var(--border-strong)",
    borderRadius: 0,
    padding: "0.7rem 0.1rem",
    background: "transparent",
  };
  const boxed: React.CSSProperties = {
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--radius-sm)",
    padding: "0.75rem 0.9rem",
    background: "var(--surface-inset)",
  };

  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        ...containerStyle,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          {label}
        </span>
      )}
      <input
        id={id}
        type={type}
        className="lisso-input"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          color: "var(--text-primary)",
          width: "100%",
          transition:
            "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
          ...(variant === "boxed" ? boxed : line),
          ...style,
        }}
        {...rest}
      />
    </label>
  );
}
