# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Spendly is a personal/family expense-tracker product. Only the **frontend** is
implemented; `backend/` and `database/` are intentionally empty folder scaffolds
(no code, no config, no dependencies) reserved for later. See
`docs/PRODUCT_PLAN.md` for the full product plan (positioning, core features,
the six differentiators, tech stack, repo layout).

Do not add backend logic, API calls, or database config unless explicitly asked —
the current state (frontend-only, mock data, no persistence) is deliberate.

## Commands

All commands run from `frontend/` (there is no root-level `package.json`):

```
cd frontend
npm install         # first-time setup
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build         # tsc -b && vite build — type-checks then bundles
npm run preview        # preview the production build
npm run lint          # eslint .
```

There is no test suite configured. There is no single-file/watch test command
because no test runner is installed.

`npm run build` is the fastest way to catch type errors across the whole app
(`tsc -b` runs in build-mode project-reference checking before Vite bundles).

## Architecture

### No backend — everything is client-side mock state

There are no network calls anywhere in the app. All "data" lives in
`frontend/src/lib/mock-data.ts` (deterministic, seeded-random generation of
accounts, transactions, budgets, goals, subscriptions, split expenses, and
notifications) and is loaded once into a single Zustand store,
`frontend/src/store/app-store.ts`. Every mutation a user can make (add
transaction, contribute to a goal, settle a split, toggle a subscription, add a
category, etc.) is a store action that does an in-memory array update — nothing
persists across a full page reload. When adding a new mutable feature, follow
this pattern: add the entity to `lib/types.ts`, seed it in `lib/mock-data.ts`,
add state + actions to `app-store.ts`, and consume via `useAppStore()`.

Theme (light/dark) is a separate, `localStorage`-persisted Zustand store,
`store/theme-store.ts`. `App.tsx` toggles the `dark` class on `document.documentElement`
based on it; Tailwind's `darkMode: "class"` picks that up.

### Derived data lives in `lib/`, not in components

- `lib/selectors.ts` — pure functions over the transaction array (monthly trends,
  category breakdowns, budget spend-to-date). Month math is always "N months
  ago from today," not calendar-aware ranges.
- `lib/health-score.ts` — computes the Financial Health Score (0–100, weighted
  from savings rate 35% / budget adherence 30% / debt ratio 20% / consistency
  15%). Takes an optional `monthsAgo` offset so the same function powers both
  the current score and the historical trend line on the Health Score page.
  Because "consistency" looks at a 3-month trailing window, `mock-data.ts`
  generates ~9 months of transaction history even though the UI only displays
  6 — trimming that buffer breaks the oldest points on the trend chart.
- `lib/icon-map.ts` — categories/goals/subscriptions store icon names as
  strings (e.g. `"Utensils"`); this maps them to actual `lucide-react`
  components. Add new icons here before referencing them by name elsewhere.

### Routing and layout shell

`App.tsx` defines two route trees: public pages (`/`, `/login`, `/signup`) and
an `/app/*` tree wrapped in `AppLayout` (sidebar + topbar + `<Outlet />`).
`components/layout/Sidebar.tsx` is the source of truth for nav structure
(grouped into Overview / Money / Unique to Spendly) — `AppLayout.tsx`'s
`TITLES` map and `MobileNav.tsx`'s flat item list must be kept in sync with it
manually when adding a page/route.

### Component layering

- `components/ui/` — generic, app-agnostic primitives (Button, Card, Modal,
  Input, Select, Switch, Dropdown, ProgressBar, etc.). No store access.
- `components/shared/` — feature components that *do* read/write
  `useAppStore()`, mostly the "add/edit X" modals (AddTransactionModal,
  BudgetModal, GoalModal, SubscriptionModal, SplitExpenseModal, AccountModal,
  CategoryModal, ContributeModal) plus ScoreRing and NotificationsDropdown.
- `pages/` — one file per route, composing `ui/` + `shared/` + store selectors.

### Styling

Tailwind with CSS-variable-based color tokens (`bg`, `bg-subtle`, `bg-raised`,
`fg`, `fg-muted`, `fg-subtle`, `border`) defined in `src/index.css` for both
`:root` and `.dark`, wired into `tailwind.config.js` via `rgb(var(--x) / <alpha-value>)`.
Prefer these semantic tokens over raw Tailwind grays so components stay
theme-correct automatically. Brand color is `brand-*` (emerald), secondary
accent is `accent-*` (violet); `income`/`expense`/`warn` are fixed semantic
colors (not theme-swapped) used for money direction and budget status.

Recharts `<YAxis>` ticks that show currency must use
`formatCurrencyCompact` (from `lib/utils.ts`) with `width={60}` and
`margin={{ left: 0 }}` — plain numeric ticks with a negative left margin were
found to visually clip (e.g. "$8,000" rendering as "000").

### Path alias

`@/*` maps to `frontend/src/*` (configured in both `tsconfig.json` and
`vite.config.ts`). Use it instead of relative `../../` imports.
