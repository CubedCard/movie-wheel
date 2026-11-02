# Movie Wheel

Can't decide what to watch? Spin the wheel.

Movie Wheel is a small Next.js app with a spinning carousel of movie posters.
Hit "Spin" and it lands on a random movie from your collection. There's a
password-protected `/admin` page for adding and removing movies (title, year,
poster image URL).

## What it does

- **`/`** — the wheel. Renders the movie collection as a horizontally
  scrolling carousel and animates a spin to a random pick.
- **`/admin`** — add/delete movies. Protected by a login.
- **`/admin/login`** — simple username/password form.
- **API routes** (`/api/movies`, `/api/movies/[id]`, `/api/login`,
  `/api/logout`) — CRUD for movies and session login/logout.
- **Auth** — a signed (HMAC) session cookie, checked in `web/src/proxy.ts`
  (Next's middleware-equivalent) to guard the admin page and the
  mutating movie endpoints.
- **Storage** — movies are currently persisted as JSON in
  `web/data/movies.json`, read and written by `web/src/lib/movies.ts`.

This is intentionally a quick, "just make it work" build — see the plan
below for where it's headed.

## Running it

Requirements: Node.js (see `web/package.json`/`web/next.config.ts` for the
Next version in use) and npm.

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin login

Default credentials are `admin` / `admin` unless overridden. Set these in
`web/.env.local` to change them:

```bash
ADMIN_USERNAME=youradminname
ADMIN_PASSWORD=yourpassword
SESSION_SECRET=some-long-random-string
```

`SESSION_SECRET` signs the session cookie — set a real random value before
deploying anywhere public.

### Other scripts

```bash
cd web
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Go backend learning plan

The existing Next.js backend remains in `web/` while a separate Go service
is developed in `backend/`. This repository is a practice ground for
learning **Go, Domain-Driven Design, and Clean Architecture**. The first
backend slice will be built and tested independently before connecting it
to the frontend.

The first backend slice has these working decisions:

- Use SQLite with Ent for persistence. Keep Ent-generated types in
  infrastructure; domain and application code must not depend on Ent.
- `POST /api/spins` creates a new spin each time, takes no request body for
  now, and chooses uniformly from all eligible movies. If no movie is
  eligible, return `204 No Content`.
- Persist the spin ID, selected movie ID, and spin time. Return the spin
  information and the selected movie fields needed by the wheel (ID, title,
  year, and image URL).
- Keep watch history as separate timestamped viewing records. A viewing can
  be recorded from a spin result or later from the movie collection; only the
  first flow has a related spin ID.

The Go module will contain four packages with inward dependency direction:

- **Domain** — business concepts and rules, with no HTTP, database, or ORM
  dependencies.
- **Application** — named use cases that coordinate domain behavior and
  repository interfaces.
- **Infrastructure** — SQLite/Ent implementations and mappings at the edge.
- **API** — thin Go HTTP handlers that translate requests and responses.

Keep changes small enough to learn from. Do not add patterns solely to match
an architecture diagram.

## Future product ideas

These are ideas to explore after the first slice:

- Categorize movies and optionally limit a spin to selected categories.
- Use ratings or other preferences to influence how likely a movie is to be picked.
- Exclude movies watched recently (for example, within the last two weeks),
  with a way to include them again.
- Derive popularity summaries or leaderboards from watch-history events.
