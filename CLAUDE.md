# CLAUDE.md — aiinfra

This file provides context for Claude (AI assistant) when working on this codebase.

> **IMPORTANT: You have direct database access!**
> Always run SQL migrations via `SUPABASE_ACCESS_TOKEN=... supabase db push` — never ask the user to run SQL manually.

> **IMPORTANT: Push changes immediately!**
> This is a GitHub Pages site — changes only go live after pushing to `main`.
> Always `git push` (or open a PR from your worktree branch) as soon as changes are ready.

> **IMPORTANT: Always set SUPABASE_ACCESS_TOKEN**
> The CLI requires it: `export SUPABASE_ACCESS_TOKEN=<token from CLAUDE.local.md>`

## Project Overview

**aiinfra** is a personal multi-function AI platform for software development of all sorts.

**Tech Stack:**
- Frontend: Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- Backend: Supabase (PostgreSQL + Auth) — project `nppcwprqiizrrnlrdeog`
- AI: Google Gemini 2.0 Flash via `ai-generate` edge function
- Email: Resend via `send-email` edge function
- Hosting: GitHub Pages (static export from `main` branch)
- i18n: Dictionary-based multi-language support

**Live URLs:**
- Public site: https://aikordek.github.io/alpacapps-infra/
- GitHub repo: https://github.com/aikordek/alpacapps-infra
- Supabase dashboard: https://supabase.com/dashboard/project/nppcwprqiizrrnlrdeog

## Deployment

Push to `main` and it's live. No build step needed for vanilla HTML pages.
For Next.js pages: `npm run build` then commit the `out/` directory.
**For Claude:** Always push changes immediately after committing.

## Tailwind CSS

- **Next.js:** Configured via PostCSS (`postcss.config.mjs`) — `@import "tailwindcss"` in `src/app/globals.css`
- **Vanilla HTML:** Standalone build at `styles/tailwind.out.css` (committed)
  - Edit: `styles/tailwind.css`
  - Rebuild: `npm run css:build`

## Shared Files (Vanilla JS Pages)

- `shared/supabase.js` — Supabase client (URL + anon key hardcoded — anon key is public-safe)
- `shared/auth.js` — Auth module: profile button, login modal, page guard
- `shared/admin.css` — Admin styles: layout, tables, modals, badges (themeable via `--aap-*` CSS vars)

### Auth System (`shared/auth.js`)

- **Profile button**: Auto-inserts into nav bar. Shows person icon when logged out, initials avatar when logged in.
- **Login modal**: Email/password via `supabase.auth.signInWithPassword()`.
- **Page guard**: Admin pages call `requireAuth(callback)` — redirects to `../index.html` if not authenticated.

**Script loading order on every page:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="shared/supabase.js"></script>
<script src="shared/auth.js"></script>
```

## Supabase Details

- **Project ref:** `nppcwprqiizrrnlrdeog`
- **Region:** East US (Ohio) — us-east-2
- **URL:** https://nppcwprqiizrrnlrdeog.supabase.co
- **Anon key** (public-safe) in: `src/lib/supabase.ts` and `shared/supabase.js`
- **Service role key** stored as Supabase secret `SERVICE_ROLE_KEY` (edge functions only)

### Supabase CLI (for Claude)

```bash
export SUPABASE_ACCESS_TOKEN=<from CLAUDE.local.md>
supabase db push                          # run migrations
supabase functions deploy <name>          # deploy edge function
supabase functions logs <name>            # check logs
supabase secrets set KEY=value            # store secret
```

> Note: Direct `psql` DNS (`db.nppcwprqiizrrnlrdeog.supabase.co`) not resolving locally — use `supabase db push` instead.

## Key Files

- `src/lib/supabase.ts` — Supabase client (Next.js)
- `src/lib/email.ts` — `sendEmail({ to, subject, html })` via Resend edge function
- `src/lib/ai.ts` — `aiGenerate({ prompt, model?, system?, history? })` via Gemini edge function
- `shared/supabase.js` — Supabase client (vanilla JS)
- `next.config.ts` — basePath: `/alpacapps-infra`
- `src/i18n/config.ts` — supported locales
- `src/i18n/dictionaries/*.json` — translation files
- `src/contexts/auth-context.tsx` — authentication context

## Edge Functions

| Function | Purpose | Auth required |
|---|---|---|
| `send-email` | Send email via Resend | Yes (JWT) |
| `ai-generate` | Gemini AI generation | Yes (JWT) |

## Database Tables

| Table | Purpose |
|---|---|
| `page_display_config` | Controls which tabs/sections are visible in the intranet |

## External Services

### Email (Resend)
- API key: Supabase secret `RESEND_API_KEY`
- Edge function: `send-email`
- Default from: `onboarding@resend.dev` (update with custom domain in `supabase/functions/send-email/index.ts`)

### AI (Google Gemini)
- API key: Supabase secret `GEMINI_API_KEY`
- Edge function: `ai-generate`
- Default model: `gemini-2.0-flash`
- Supports: prompt, system instruction, multi-turn history, model override

## Conventions

1. Use toast notifications, not `alert()`
2. Filter archived items client-side
3. Don't expose personal info in public views
4. Client-side image compression for files > 500 KB
5. All new DB tables must have RLS enabled
6. Secrets never go in committed files — use Supabase secrets or `.env.local`
