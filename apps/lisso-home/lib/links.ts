/**
 * External destinations referenced from the corporate site.
 *
 * ShishaOS is a separate deployment (the ShishaOS app). It defaults to
 * the project's production Vercel URL; override with NEXT_PUBLIC_SHISHAOS_URL
 * when a custom domain (e.g. https://shisha-os.lisso.jp) is connected.
 */
export const SHISHAOS_URL =
  process.env.NEXT_PUBLIC_SHISHAOS_URL ??
  "https://shisha-artificial-intelligence.vercel.app";

export const SHOP_URL = "https://lisso.base.shop/";
export const INSTAGRAM_URL = "https://www.instagram.com/shisha.cafe.lisso/";
