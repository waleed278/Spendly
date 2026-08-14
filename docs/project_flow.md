# Spendly — Tech Stack, Architecture & Development Flow

This document defines the complete target tech stack, system architecture,
data model, and the phase-by-phase plan for taking Spendly from its current
state (frontend-only, mock data) to a fully working, deployed product.

## Complete tech stack

### Frontend (built — see `progress.md`)
| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS (custom design tokens, light/dark) |
| Routing | React Router v6 |
| Client state | Zustand (UI-only state after backend integration: theme, sidebar) |
| Server state *(Phase 4+)* | TanStack Query (React Query) |
| Charts | Recharts |
| Animation | Framer Motion |
| Forms & validation | React Hook Form + Zod |
| Icons | lucide-react |

### Backend *(planned)*
| Concern | Choice |
|---|---|
| Framework | **Django** |
| API layer | **Django REST Framework (DRF)** |
| Auth | `djangorestframework-simplejwt` (JWT access + refresh tokens) |
| Database | **PostgreSQL** |
| ORM | Django ORM |
| Filtering / search | `django-filter` |
| CORS | `django-cors-headers` (allow the Vite/production frontend origin) |
| Environment config | `django-environ` (`.env`-based settings) |
| Admin | Django admin (registered for every model — free internal CRUD/debug UI) |
| Background/async tasks *(later phase)* | Celery + Redis, for things like recurring-subscription reminders |

### Infrastructure / tooling *(planned)*
| Concern | Choice |
|---|---|
| Local dev orchestration | Docker Compose (Django + PostgreSQL + frontend) |
| CI | GitHub Actions (lint, type-check, test, build on every push) |
| Backend hosting | Render / Railway / Fly.io (managed PostgreSQL add-on) |
| Frontend hosting | Vercel / Netlify |
| Backend tests | `pytest-django` |
| Frontend tests | Vitest + React Testing Library |

## Architecture overview

Spendly is a standard decoupled SPA + REST API architecture:

```
┌────────────────────┐        HTTPS / JSON        ┌──────────────────────────┐
│   React SPA         │ ─────────────────────────▶ │   Django + DRF API        │
│   (Vite build)       │ ◀───────────────────────── │   /api/v1/...             │
│   hosted on Vercel   │        JWT in header        │   hosted on Render/Fly    │
└────────────────────┘                             └───────────┬──────────────┘
                                                                  │
                                                                  ▼
                                                       ┌───────────────────┐
                                                       │   PostgreSQL        │
                                                       │   (managed)         │
                                                       └───────────────────┘
```

The frontend never talks to the database directly — all reads/writes go
through versioned DRF endpoints. The frontend's existing Zustand store
structure maps almost 1:1 onto the planned API resources, which is what makes
the Phase 4 integration (below) a swap of the data source rather than a
rewrite of the UI.

## Data model

One authenticated user owns most rows below (`user` FK on each, enforced by
DRF permission classes so users can only see/edit their own data).

| Model | Key fields | Notes |
|---|---|---|
| **User** | email, full_name, currency_preference, date_format_preference | Custom Django user model, email as the login field |
| **Account** | user, name, type (bank/cash/card/wallet), balance, currency, color, institution, last4 | Mirrors frontend `Account` type |
| **Category** | user (nullable = global default), name, icon, color, kind (income/expense) | Seed a default set per new user on signup |
| **Transaction** | user, account (FK), category (FK), type (income/expense/transfer), amount, date, merchant, note, tags, recurring | Core ledger entity |
| **Budget** | user, category (FK, unique per user+period), limit, period | Monthly limit per category |
| **Goal** | user, name, icon, color, target_amount, current_amount, deadline | `contribute` is a dedicated endpoint, not a raw PATCH, so it can be validated/audited |
| **Subscription** | user, name, icon, color, amount, cycle (monthly/yearly/weekly), next_charge_date, category (FK), status | Monthly-equivalent normalization done server-side too, so frontend and any future client agree |
| **SplitExpense** | user (creator), description, amount, paid_by, date, category (FK) | |
| **SplitParticipant** | split_expense (FK), name, avatar_color, share, settled | One row per person on a split, including the creator |
| **Notification** | user, type, title, message, date, read | System + generated (budget alert, bill reminder, goal milestone, insight) |

`HealthScoreBreakdown` and the What-If Simulator projection are **not**
stored models — they're computed on request from Transaction/Budget/Goal data
by dedicated read-only endpoints, exactly mirroring `lib/health-score.ts` and
the simulator math already implemented on the frontend.

## API design

REST, versioned under `/api/v1/`, DRF `ModelViewSet`s + routers for standard
CRUD resources, plus a small set of computed/action endpoints for the
differentiator features:

```
/api/v1/auth/register/          POST
/api/v1/auth/login/             POST   (returns access + refresh JWT)
/api/v1/auth/refresh/           POST
/api/v1/auth/me/                GET, PATCH

/api/v1/accounts/               GET, POST
/api/v1/accounts/{id}/          GET, PATCH, DELETE

/api/v1/categories/             GET, POST
/api/v1/transactions/           GET, POST     (filterable: type, category, account, date range, search)
/api/v1/transactions/{id}/      GET, PATCH, DELETE

/api/v1/budgets/                GET, POST
/api/v1/budgets/{id}/           GET, PATCH, DELETE

/api/v1/goals/                  GET, POST
/api/v1/goals/{id}/             GET, PATCH, DELETE
/api/v1/goals/{id}/contribute/  POST   {amount}

/api/v1/subscriptions/          GET, POST
/api/v1/subscriptions/{id}/     GET, PATCH, DELETE
/api/v1/subscriptions/{id}/toggle-status/  POST

/api/v1/splits/                 GET, POST
/api/v1/splits/{id}/            GET, PATCH, DELETE
/api/v1/splits/{id}/settle/     POST   {participant_id}

/api/v1/notifications/          GET
/api/v1/notifications/{id}/read/  POST
/api/v1/notifications/read-all/   POST

/api/v1/insights/health-score/     GET   (?months_ago=0)
/api/v1/insights/health-score/history/  GET
/api/v1/insights/simulate/         POST  {goal_id, cuts: {category_id: percent}}
/api/v1/insights/reports/summary/  GET   (?range=3|6|12)
```

## Auth strategy

- Email + password registration and login.
- `djangorestframework-simplejwt` issues short-lived access tokens and
  longer-lived refresh tokens; frontend stores the access token in memory and
  the refresh token in an HttpOnly cookie (avoids `localStorage` token theft
  via XSS).
- Every non-auth endpoint requires `IsAuthenticated`; object-level
  permissions ensure a user can only read/write rows where `user == request.user`.
- Password reset / email verification are Phase 5+ (post-MVP) additions, not
  required to replace the current demo login screen.

## Planned backend folder structure (Django apps)

```
backend/
  manage.py
  config/                 # project package: settings, root urls, wsgi/asgi
    settings/
      base.py
      dev.py
      prod.py
    urls.py
  apps/
    users/                # custom User model, registration/login/me
    finance/               # Account, Category, Transaction, Budget, Goal
    subscriptions/          # Subscription
    splits/                 # SplitExpense, SplitParticipant
    notifications/           # AppNotification
    insights/                # health-score + simulator + reports endpoints (no models — reads from finance app)
    core/                    # shared abstract base models, permissions, pagination
  requirements/
    base.txt
    dev.txt
    prod.txt
  Dockerfile
  .env.example
```

Each domain app follows the standard DRF layout: `models.py`,
`serializers.py`, `views.py` (ViewSets), `urls.py`, `permissions.py`,
`admin.py`, `tests/`.

## Development phases

### Phase 0 — Product planning & frontend (✅ done)
Product plan, full React UI built and verified against seeded mock data. See
`progress.md` for the complete breakdown.

### Phase 1 — Backend foundation
- Initialize Django project (`config/` + `apps/` layout above).
- Configure PostgreSQL via `django-environ` (`.env` for local, real env vars
  in prod).
- Install & configure DRF, `django-cors-headers`, `django-filter`.
- Custom `User` model (email-based login) + Django admin wired for every
  model as they're added.
- `docker-compose.yml` for local Postgres so the whole team runs the same DB
  version.

### Phase 2 — Core domain APIs
- `finance` app: Account, Category, Transaction, Budget, Goal models,
  migrations, serializers, ViewSets, owner-only permissions.
- Auth endpoints (register / login / refresh / me) via SimpleJWT.
- Seed default categories on user signup (mirrors current
  `lib/mock-data.ts` category list).
- Pagination + filtering on the Transactions list endpoint (date range,
  category, account, type, search) to match the frontend's existing filter
  UI.

### Phase 3 — Differentiator APIs
- `subscriptions` app + monthly-equivalent calculation, matching
  `monthlyEquivalent()` currently implemented in `pages/Subscriptions.tsx`.
- `splits` app + settle endpoint, matching the owed/owe calculation currently
  in `pages/SplitExpenses.tsx`.
- `insights` app: server-side port of `lib/health-score.ts` (same weights:
  savings rate 35%, budget adherence 30%, debt ratio 20%, consistency 15%)
  and of the What-If Simulator projection math from `pages/Simulator.tsx`.
- `notifications` app + read/unread endpoints.

### Phase 4 — Frontend/backend integration
- Add an API client layer (`src/lib/api.ts` or similar) and TanStack Query
  for server-state caching, retries, and optimistic updates.
- Replace `lib/mock-data.ts` + `store/app-store.ts` incrementally, resource
  by resource, in this order: auth → accounts → transactions → categories →
  budgets → goals → subscriptions → splits → notifications → insights.
  `store/theme-store.ts` and sidebar-collapse state stay in Zustand — they're
  genuinely UI-only.
- Wire the topbar search input to the real Transactions endpoint.
- Real Login/Signup forms replace the current demo forms.

### Phase 5 — Testing & hardening
- `pytest-django` unit + API tests per app (model validation, permission
  boundaries, computed-endpoint correctness against known fixtures).
- Vitest + React Testing Library for frontend components and store logic.
- Security pass: CORS allow-list, DRF throttling/rate limiting, dependency
  audit, secrets never committed (`.env` stays out of git — already covered
  by `.gitignore`).

### Phase 6 — Deployment
- Dockerize the Django app; `docker-compose.yml` extended for a
  production-like local run.
- CI (GitHub Actions): lint + type-check + test + build on every push;
  block merge on failure.
- Deploy backend + managed PostgreSQL to Render/Railway/Fly.io; deploy
  frontend to Vercel/Netlify; wire the frontend's API base URL via a build-time
  environment variable.
- Custom domain, HTTPS, basic uptime monitoring.

### Phase 7 — Post-launch / stretch
- Spending Streaks (gamification) — the sixth differentiator from
  `project_overview.md`, not yet built.
- Push/email notifications (budget alerts, bill reminders) via Celery + Redis
  background jobs.
- Live currency exchange rates for true multi-currency support.
- Bank sync (Plaid or a regional equivalent) to remove manual transaction
  entry.
- Native mobile app (React Native), reusing the same DRF API.

## Local development workflow (once Phase 1 lands)

```
# backend
cd backend
cp .env.example .env
docker compose up -d db
python manage.py migrate
python manage.py runserver

# frontend (unchanged)
cd frontend
npm install
npm run dev
```

The frontend's `VITE_API_BASE_URL` environment variable will point at the
local Django server during development and at the deployed API URL in
production builds.
