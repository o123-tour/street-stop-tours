<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project Architecture & Hosting Rules (MUST FOLLOW)

- **Static GitHub Pages Hosting (`https://streetstoptours.com`)**:
  - This site is statically prerendered and deployed to GitHub Pages via `.github/workflows/deploy.yml`.
  - **NEVER** delete or remove `.github/workflows/deploy.yml`, `public/CNAME`, `public/.nojekyll`, `src/assets/*.jpg`, or the `prerender` / `spa` / `sitemap` configuration in `vite.config.ts`.
  - **NEVER** replace direct `.jpg` imports in `src/lib/content.ts` with `.asset.json` proxy URLs.
- **No Supabase / No Server Functions**:
  - **NEVER** use or add Supabase (`@supabase/supabase-js`, `src/integrations/supabase`, `supabase/`), Drizzle (`drizzle/`, `drizzle.config.ts`), Postgres, or TanStack Start server functions (`createServerFn` / `useServerFn`). There is no backend server on GitHub Pages.
  - All bookings (`src/routes/book.tsx`) and reviews (`src/components/Reviews.tsx`) MUST communicate directly from the browser with the Google Apps Script Web App URL defined in `src/lib/google-script.ts` (`GOOGLE_SCRIPT_URL`).
- **Schedule Rules**:
  - Keep booking availability rules (`canBook`, `tourMonths`, `timesForDay`) in the shared `src/lib/schedule.ts` module and enforce them in the booking form.
