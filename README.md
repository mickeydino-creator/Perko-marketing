# Perko - marketing site

Landing page for Perko, a shared digital loyalty platform for local businesses in Israel. Hebrew, RTL, static.

## Stack

- [Astro 5](https://astro.build) with plain CSS and one small TypeScript module (`src/scripts/main.ts`).
- Font: Heebo (variable), self-hosted through `@fontsource-variable/heebo`.
- No UI framework and no backend.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Structure

- `src/pages/index.astro` - the page, section order.
- `src/components/sections/` - one component per section.
- `src/components/screens/`, `Phone.astro`, `ui/` - the illustrative app screens (they scale with the phone width).
- `src/components/Wordmark.astro`, `AppIcon.astro`, `public/favicon.svg` - brand mark: the "o" of the wordmark and the bowl of the "p" in the icon are a collected stamp.
- `src/styles/global.css` - tokens (colours, type steps, spacing, motion), base styles, buttons.
- `src/styles/app.css` - styles of the illustrative app.
- `src/data/businesses.ts` - the sample businesses used in mockups and in the demo.
- `src/data/credits.json` - sources and licences of the photographs (credited in the footer).

## Before launch

1. **Interest form.** Set `PUBLIC_FORM_ENDPOINT` (see `.env.example`) to an endpoint that accepts a JSON POST
   (`business`, `type`, `name`, `contact`, `message`, `source`). Without it the form validates and then tells
   the visitor plainly that it is not connected yet and that nothing was sent.
2. **Privacy.** The form says the details are used only to get back to the business. Add a privacy policy link
   once one exists.
3. **Contact and legal details** are deliberately absent from the footer until real ones exist.
4. **Product claims.** All screens, business names, numbers and the business setup screen are illustrations of
   the planned product. Review the copy against what is actually built at launch.

## Photographs

Four street and market photographs from Wikimedia Commons (CC BY 2.0, CC BY 3.0, CC BY-SA 4.0), resized to WebP.
They show the world of local businesses and are credited in the footer; none of the businesses in them is a
Perko partner.
