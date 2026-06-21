import React from "react";

/**
 * LISSO Logo — typographic wordmark with the metallic "design point" particle.
 * The identity is letterspaced gothic (honest) + a single rotated metallic
 * square that stands for a designed point of taste/structure.
 */
export type LogoProps = {
  size?: number;
  color?: string;
  showMark?: boolean;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function Logo({
  size = 22,
  color = "var(--paper-50)",
  showMark = true,
  style = {},
  ...rest
}: LogoProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${size * 0.42}px`,
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: "var(--weight-medium)" as unknown as number,
          fontSize: `${size}px`,
          letterSpacing: `${size * 0.28}px`,
          color,
          lineHeight: 1,
          paddingLeft: `${size * 0.28}px`,
        }}
      >
        LISSO
      </span>
      {showMark && (
        <span
          aria-hidden="true"
          style={{
            width: `${size * 0.32}px`,
            height: `${size * 0.32}px`,
            background: "var(--accent-metallic)",
            transform: "rotate(45deg)",
            flex: "none",
          }}
        />
      )}
    </span>
  );
}
