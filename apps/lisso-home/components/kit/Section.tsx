import React from "react";

/**
 * Section shell: consistent vertical rhythm + content width.
 */
export type SectionProps = {
  id?: string;
  children?: React.ReactNode;
  bg?: string;
  pad?: string;
  maxw?: string;
  style?: React.CSSProperties;
};

export function Section({
  id,
  children,
  bg = "var(--bg-page)",
  pad = "var(--space-10)",
  maxw = "var(--maxw-content)",
  style = {},
}: SectionProps) {
  return (
    <section
      id={id}
      className="lz-section"
      style={{ background: bg, padding: `${pad} var(--gutter)`, ...style }}
    >
      <div style={{ maxWidth: maxw, margin: "0 auto", width: "100%" }}>
        {children}
      </div>
    </section>
  );
}
