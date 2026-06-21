import React from "react";

/**
 * LISSO Divider — a hairline rule. `label` drops a small mono marker inset
 * on the line (e.g. a section number). Vertical option for split layouts.
 */
export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Divider({
  orientation = "horizontal",
  label = null,
  style = {},
  ...rest
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        aria-hidden="true"
        style={{
          width: "1px",
          alignSelf: "stretch",
          background: "var(--border-hairline)",
          ...style,
        }}
        {...rest}
      />
    );
  }
  if (label) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "1rem", ...style }}
        {...rest}
      >
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span
          style={{ flex: 1, height: "1px", background: "var(--border-hairline)" }}
        />
      </div>
    );
  }
  return (
    <hr
      style={{
        height: "1px",
        border: 0,
        background: "var(--border-hairline)",
        margin: 0,
        ...style,
      }}
      {...rest}
    />
  );
}
