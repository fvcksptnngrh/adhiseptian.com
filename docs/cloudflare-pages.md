# Cloudflare Pages deployment

This project is deployed with Cloudflare Pages Functions from the `functions/` directory. The legacy Vercel configuration has been removed so a future deployment does not suggest that Vercel environment variables control the live site.

Configure the following variables in **Cloudflare Dashboard → Workers & Pages → portfolio → Settings → Variables and Secrets** for both **Production** and **Preview**. Trigger a new deployment after changing a variable.

| Variable | Add as | Used by |
| --- | --- | --- |
| `WAKATIME_API_KEY` | Secret | `/api/wakatime` |
| `GITHUB_TOKEN` | Secret | `/api/github` |
| `SUPABASE_URL` | Variable | `/api/engagements`, `/api/guestbook`, client guestbook auth |
| `SUPABASE_ANON_KEY` | Variable | `/api/engagements`, `/api/guestbook`, client guestbook auth |

`GITHUB_TOKEN` can be a fine-grained token with no repository permissions; it is used only to raise GitHub's API limit. It and the WakaTime key are never added to Nuxt public runtime config.

Supabase's anonymous key is intentionally a public client identifier, not a privileged secret. It must be available at build time for the guestbook's browser-side sign-in flow. Keep Row Level Security enabled in Supabase and never substitute a `service_role` key here.

The Cloudflare Pages build settings are:

| Setting | Value |
| --- | --- |
| Build command | `npm run generate` |
| Build output directory | `dist` |

Verify the Production domain and the generated Preview URL independently after deployment:

```text
/api/wakatime     -> 200, configured: true
/api/github       -> 200 with followers, public_repos, and following
/api/engagements  -> 200, configured: true, views, and reactions
/api/guestbook    -> 200 and an array of messages
```

If GitHub limits an unconfigured or exhausted request, `/api/github` returns HTTP 429 with `code: "GITHUB_RATE_LIMITED"`, rather than returning zero-valued statistics. If Supabase configuration or a query fails, `/api/engagements` returns a non-2xx response with a `SUPABASE_*` code; a genuine empty database still returns a successful response with zero counts.
