import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Instagram,
  Server,
  Shield,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  Check,
  type LucideIcon,
} from "lucide-react";

/**
 * Thin-line icon helper, matching the minimal brand. The design system kit
 * used Lucide via CDN + a data-attribute; here we use the `lucide-react`
 * package and map the same kebab-case names to their components.
 */
const ICONS: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  instagram: Instagram,
  server: Server,
  shield: Shield,
  "trending-up": TrendingUp,
  "shopping-bag": ShoppingBag,
  "external-link": ExternalLink,
  check: Check,
};

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

export function Icon({
  name,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.5,
  style = {},
}: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return (
    <span style={{ display: "inline-flex", color, ...style }}>
      <Cmp width={size} height={size} strokeWidth={strokeWidth} stroke={color} />
    </span>
  );
}
