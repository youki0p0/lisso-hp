# lisso-home

Corporate site for 合同会社 LISSO — Shisha Division + Technology Division.
Implemented from the **LISSO Design System** (exported from Claude Design).

> 香りを設計する。インフラを設計する。体験を設計する。

## Stack

- **Next.js (App Router)** + **TypeScript**
- Design-system **CSS tokens** (`app/tokens/`) consumed via `app/globals.css` —
  no Tailwind; components style themselves with inline `var(--*)` tokens, exactly
  as the design system defines them.
- **lucide-react** for the thin-line icon set (replaces the kit's Lucide CDN).
- Webfonts (Shippori Mincho / Zen Kaku Gothic New / IBM Plex Mono) via Google Fonts.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Structure

```
app/
  layout.tsx        root layout (lang=ja, metadata, globals.css)
  page.tsx          single-page site: sticky nav + scroll-spy + all sections
  globals.css       @imports the design-system tokens, in order
  tokens/           color / typography / spacing / base / interactions / responsive
components/
  ds/               design-system primitives
                    Button · Card · Divider · Eyebrow · Input · Logo · Stat ·
                    Tag · VectorBar · NavBar
  kit/              page helpers: Section · Photo · Icon (lucide-react)
  sections/         Hero · Divisions · Shisha · Shop · FlavorOS · Technology ·
                    CompanyContact (+ Footer)
public/assets/      brand marks, product photo, textures
```

## Sections (in order)

1. **Hero** — 「香りを、設計する。」 + the two-division promise.
2. **Two Divisions** — Shisha | Technology, split with a hairline divider.
3. **Shisha Division** — café intro, access/meta, Instagram feed grid.
4. **Shop** — BASE storefront preview (`lisso.base.shop`); products are placeholders.
5. **Flavor OS** — inventory → mix → reproduce flow + a live taste-vector card.
6. **Technology Division** — Build. Secure. Improve., capabilities, track record.
7. **Company / Contact** — company table + contact form (20+ / no-health-claims notice).
8. **Footer** — wordmark, links, responsible-use line.

## Notes

- **Photography is placeholdered** (`<Photo>`). The Shisha hero and Shop POD use the
  real plain-background product photo from `public/assets/`; replace the grey panels
  with real images when available.
- **Brand rules preserved**: no exaggeration, no health-efficacy claims, 20+ only,
  the two divisions are connected by the shared idea of *design*.
