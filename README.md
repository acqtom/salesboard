# Sales Board

A single-file sales & commissions dashboard: a Post Call Form for logging calls, a
live-recomputing performance dashboard, commission tracking, and a raw data view —
all in one static `index.html` with no build step and no backend.

## Live site

https://acqtom.github.io/salesboard/

## Running locally

Open `index.html` directly in a browser. That's it — no install, no server, no
dependencies.

## Logging in

Two accounts are available:

| Offer  | Password  |
|--------|-----------|
| Alex   | Alex123   |
| Adriel | Adriel123 |

Each account gets its own dashboard: deals logged under one never appear under the
other.

## How data actually works (read this before relying on it)

- There is no backend and no database. Everything is one static HTML file.
- Each account's data (logged calls, closer/setter picklists) is saved to the
  browser's `localStorage`, namespaced per account.
- **Data does not sync across devices or browsers.** Logging in as "Alex" on a
  different computer, a different browser, or in a private/incognito window starts
  from an empty dashboard — it does not fetch Alex's data from anywhere else.
- Clearing site data/storage for this page wipes whatever's logged.
- If you need real multi-device persistence, this needs a real backend (a database
  + API) behind the Post Call Form and dashboard — the current version is a
  client-only prototype.

## Security note

The login is **not real authentication** — it's a lightweight client-side gate that
picks which local dataset to load. There is no server validating the password, and
the credentials are visible to anyone who views the page source. Don't rely on this
to keep data private from a technically capable person who has access to the
deployed page.

## Tech

Plain HTML/CSS/JS. No framework, no build tooling, no dependencies, no npm scripts —
just open the file.
