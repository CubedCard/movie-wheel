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
- **Auth** — a signed (HMAC) session cookie, checked in `src/proxy.ts`
  (Next's middleware-equivalent) to guard the admin page and the
  mutating movie endpoints.
- **Storage** — movies are persisted as JSON in `data/movies.json`. No
  database yet — it's a flat file read/written by `src/lib/movies.ts`.

This is intentionally a quick, "just make it work" build — see the plan
below for where it's headed.

## Running it

Requirements: Node.js (see `package.json`/`next.config.ts` for the Next
version in use) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin login

Default credentials are `admin` / `admin` unless overridden. Set these in
a `.env.local` file to change them:

```bash
ADMIN_USERNAME=youradminname
ADMIN_PASSWORD=yourpassword
SESSION_SECRET=some-long-random-string
```

`SESSION_SECRET` signs the session cookie — set a real random value before
deploying anywhere public.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## The plan: a DDD / clean architecture backend

The current backend (`src/lib/movies.ts`, `src/lib/auth.ts`, the API routes)
is deliberately "slop": business logic, persistence, and HTTP concerns are
all smashed together so the frontend had something to talk to. This repo is
also a practice ground for learning **Domain-Driven Design and Clean
Architecture**, so the plan is to rebuild the backend properly behind the
same API surface the frontend already uses:

- **Domain layer** — a `Movie` entity/value objects and the rules around it
  (e.g. what makes a movie valid, how a pick is selected), with no
  framework or storage code at all.
- **Application layer** — use cases like `AddMovie`, `DeleteMovie`,
  `ListMovies`, `PickRandomMovie`, `AuthenticateAdmin`, orchestrating domain
  logic and depending only on repository *interfaces*.
- **Infrastructure layer** — concrete implementations of those
  repositories: a filesystem/JSON one to start, swappable later for a real
  database, plus the actual session/crypto implementation behind an
  `AuthService` interface.
- **Interface/adapter layer** — the Next.js route handlers become thin
  controllers that call use cases and map results to HTTP responses; no
  business logic left in `src/app/api/**`.

Goals for this refactor:

1. Keep the frontend (`MovieWheel`, `AdminMovieManager`) untouched — the
   API contract stays the same.
2. Introduce clear dependency direction: domain depends on nothing,
   application depends on domain, infrastructure/interfaces depend inward.
3. Swap the JSON file store for a real database later without touching
   domain or application code — that's the test of whether the boundaries
   actually held.
4. Use this as a repeatable learning exercise: small, deliberate steps
   (domain first, then use cases, then infra, then wiring) rather than a
   big-bang rewrite.
