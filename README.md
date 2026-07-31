# Sales Board

A sales & commissions dashboard: a Post Call Form for logging calls, a
live-recomputing performance dashboard, commission tracking, and a raw data view —
a static `index.html` frontend (no build step) backed by a couple of Vercel
serverless functions and Upstash Redis for storage.

## Running locally

The frontend is still just `index.html`, but data now goes through `/api`, so it
needs to run behind Vercel to work end to end:

```
npm install -g vercel   # if you don't have it
vercel dev
```

`vercel dev` serves `index.html` and the `/api` functions together and picks up the
Upstash env vars from the linked Vercel project (`vercel link` first if needed).
Opening `index.html` directly as a `file://` URL will load the page but the
form/dashboard won't be able to reach `/api`.

## Logging in

Two accounts are available:

| Offer  | Password  |
|--------|-----------|
| Alex   | Alex123   |
| Adriel | Adriel123 |

Each account gets its own dashboard: deals logged under one never appear under the
other.

## How data actually works

- Data lives in Upstash Redis, namespaced per account: `deals:<offer>`,
  `closers:<offer>`, `setters:<offer>`.
- `index.html` never talks to Redis directly. It calls two serverless functions in
  `/api`:
  - `POST /api/session` — validates the offer/password and returns that account's
    `deals`/`closers`/`setters`. Used on login and by the periodic poll.
  - `POST /api/save` — validates and writes whichever of
    `deals`/`closers`/`setters` are included in the request body.
  - Both live in `api/`, with the Upstash client and the account list factored out
    into `api/_lib/redis.js` and `api/_lib/auth.js`. The Upstash REST token is only
    ever read from env vars inside these functions — it's never sent to the browser.
- **Data now syncs across devices and browsers.** The dashboard re-fetches from
  `/api/session` every ~8 seconds and whenever the tab regains focus, so changes
  made on one device show up on others without a manual reload.
- The account list and passwords are hardcoded in `api/_lib/auth.js` — there's no
  user-management system, sign-up flow, or per-user secrets beyond that.

## Security note

The login is still a lightweight, fixed two-account gate rather than a full auth
system — but credentials are now checked server-side in `api/_lib/auth.js` on every
`/api/session` and `/api/save` call, since those endpoints read and write real
shared data. The browser caches the logged-in offer/password in `localStorage` so a
page reload doesn't log you out; treat that the same as the original: not a secret
worth protecting rigorously, just enough to keep one account's data separate from
the other's.

## Tech

Plain HTML/CSS/JS frontend, no framework or build tooling. `/api` is plain Node.js
Vercel serverless functions using `@upstash/redis` (see `package.json`).
