/**
 * External destinations referenced from the corporate site.
 *
 * Flavor OS is a separate deployment (the Shisha Flavor OS app). It defaults to
 * the project's production Vercel URL; override with NEXT_PUBLIC_FLAVOR_OS_URL
 * when a custom domain (e.g. https://flavor-os.lisso.jp) is connected.
 */
export const FLAVOR_OS_URL =
  process.env.NEXT_PUBLIC_FLAVOR_OS_URL ??
  "https://shisha-artificial-intelligence.vercel.app";

export const SHOP_URL = "https://lisso.base.shop/";
export const INSTAGRAM_URL = "https://www.instagram.com/shisha.cafe.lisso/";
