# Spendly — Development Progress

Last updated: 2026-08-14

## Status at a glance

| Layer | Status |
|---|---|
| Product plan & UX design | Done |
| Frontend UI (all pages, mock data) | Done — running, builds clean |
| Backend API | Not started (scaffold folder only) |
| Database | Not started (scaffold folder only) |
| Auth | Not started (login/signup screens exist, are non-functional demos) |
| Tests | None yet |
| Deployment | None yet |

The project currently consists of a **fully built, fully interactive frontend
running entirely on in-memory mock data** — no network calls, no persistence
beyond `localStorage` for the theme preference. Everything a user can click,
add, edit, filter, or toggle actually works and updates the UI live; it just
doesn't survive a page reload yet.

## Tech stack actually in use (frontend)

| Concern | Choice | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.5.4 |
| Build tool | Vite | 5.3.5 |
| Styling | Tailwind CSS | 3.4.7 |
| Routing | React Router | 6.26.0 |
| State management | Zustand | 4.5.4 |
| Charts | Recharts | 2.12.7 |
| Animation | Framer Motion | 11.3.19 |
| Forms | React Hook Form + Zod | 7.52.2 / 3.23.8 |
| Icons | lucide-react | 0.427.0 |
| Dates | date-fns | 3.6.0 |
| Class utilities | clsx + tailwind-merge | 2.1.1 / 2.5.2 |

No backend framework, ORM, or database driver is installed anywhere in the
repo yet — `backend/` and `database/` are empty scaffolds (folder structure
and a README explaining intent only).

## What's been built

### Product planning
- `docs/PRODUCT_PLAN.md` — positioning, core features, six differentiators,
  tech stack decision, repo layout.
- `docs/project_overview.md` — expanded pitch and competitive framing.
- This file and `docs/project_flow.md` — progress tracking and the phased
  backend/integration roadmap.

### App shell
- Responsive sidebar (`components/layout/Sidebar.tsx`) grouped into
  **Overview** (Dashboard, Reports, Health Score), **Money** (Transactions,
  Accounts, Budgets, Goals), and **Unique to Spendly** (Subscriptions,
  Split & IOU, What-If Simulator), plus a collapse toggle.
- Mobile nav drawer (`components/layout/MobileNav.tsx`) for `<lg` breakpoints.
- Topbar (`components/layout/Topbar.tsx`) with global search input (UI only,
  not wired to filtering yet), quick "Add Transaction," theme toggle,
  notifications dropdown, and a profile/account dropdown.
- Full light/dark theme via CSS variable tokens, persisted to `localStorage`.

### Pages implemented (13 total)

| Page | Route | Key functionality |
|---|---|---|
| Landing | `/` | Marketing page: hero, core feature grid, differentiator grid, pricing tiers, CTA |
| Login / Signup | `/login`, `/signup` | Demo-mode forms — any input routes into `/app` (no real auth) |
| Dashboard | `/app` | Net worth, income/expense/savings stat cards, 6-month income-vs-expense area chart, Financial Health Score widget, category donut, budget progress, upcoming bills, recent transactions, auto-generated text insights |
| Transactions | `/app/transactions` | Full list with search, type/category/account filters, sortable columns, delete, "Add Transaction" modal |
| Budgets | `/app/budgets` | List view with progress bars and over-budget warnings; toggleable **Jar Mode** visual view; add/edit budget modal |
| Goals | `/app/goals` | Progress rings per goal, "Add Funds" contribution modal, new-goal modal, completed-goal state |
| Reports | `/app/reports` | 3/6/12-month range toggle, income-vs-expense bar chart, category pie + legend, net cash flow line chart, top merchants list |
| Accounts | `/app/accounts` | Net worth / assets / liabilities summary, accounts grouped by type (bank/cash/card/wallet), add-account modal |
| Subscriptions | `/app/subscriptions` | Monthly/yearly totals normalized across billing cycles, priciest-subscription alert, cancel/reactivate toggle, add-subscription modal |
| Split & IOU | `/app/split` | "You are owed" / "you owe" summary computed from split data, per-participant settle toggles, new-split modal with equal-split calculation |
| What-If Simulator | `/app/simulator` | Per-category spend-cut sliders, goal selector, projected-savings chart comparing current pace vs. simulated pace vs. goal line |
| Health Score | `/app/health-score` | Large score ring, 6-month score history chart, four sub-score breakdown bars (savings rate, budget adherence, debt ratio, consistency), auto-generated improvement tips |
| Settings | `/app/settings` | Profile form, theme selector, currency/date-format selects, notification-preference toggles, category list + add-category modal |
| 404 | `*` | Not-found fallback |

### Data layer (mock, in-memory)

- `lib/types.ts` — TypeScript types for every domain entity: Category,
  Account, Transaction, Budget, Goal, Subscription, SplitExpense /
  SplitParticipant, AppNotification, HealthScoreBreakdown.
- `lib/mock-data.ts` — deterministic seeded-random generator producing ~9
  months of realistic transaction history (salary, rent, freelance income,
  day-to-day spending across categories), plus hand-authored accounts,
  budgets, goals, subscriptions, split expenses, and notifications.
- `lib/selectors.ts` — pure derived-data functions: monthly income/expense
  trend, category breakdown, budget spend-to-date.
- `lib/health-score.ts` — the weighted Financial Health Score calculation,
  parameterized by `monthsAgo` so it can render both the current score and a
  historical trend.
- `store/app-store.ts` — single Zustand store holding all entity arrays plus
  every mutation the UI exposes (`addTransaction`, `deleteTransaction`,
  `addBudget`, `updateBudgetLimit`, `addGoal`, `contributeToGoal`,
  `markNotificationRead`, `toggleSubscriptionStatus`,
  `settleSplitParticipant`, `addAccount`, `addSubscription`,
  `addSplitExpense`, `addCategory`, `toggleSidebar`).
- `store/theme-store.ts` — separate persisted store for light/dark theme.

### UI component library

Reusable, store-agnostic primitives in `components/ui/`: Button, Card, Badge,
ProgressBar, Modal, Input/Label/Textarea, Select, Tabs, Avatar, Dropdown,
StatCard, Switch, CategoryIcon. Feature-level components that read/write the
store live in `components/shared/`: seven "add/edit" modals plus ScoreRing and
NotificationsDropdown.

## Verification done

- `npm run build` (TypeScript project-reference check + Vite production
  build) passes clean with no errors.
- Every page manually clicked through in the running dev server, in both
  light and dark theme.
- Interactive flows verified end-to-end: adding a transaction, contributing
  funds to a goal (ring and dollar amount update live), dragging a What-If
  Simulator slider (savings/timeline numbers and chart update live), toggling
  a subscription's status, settling a split participant, switching Budgets
  between List and Jar mode.
- Two real bugs found and fixed during verification: a computed-member JSX
  expression that failed to compile in `Accounts.tsx`, and Recharts Y-axis
  currency labels clipping (fixed with a compact currency formatter + fixed
  axis width).
- No console errors in the browser; only React Router's routine v7
  future-flag advisories.

## Known gaps / deliberate trade-offs

- **No backend, no persistence.** Every mutation lives only in the Zustand
  store for the current browser session; a full reload resets to the seeded
  mock dataset.
- **No real authentication.** Login/Signup are demo forms that route straight
  into `/app` regardless of input.
- **No tests.** No test runner is installed; `npm run build`'s type-check is
  currently the only automated correctness signal.
- **Single implicit user.** There's no multi-user concept yet — Split & IOU
  hardcodes "You" as the current user.
- **Bundle size warning.** The production JS bundle is ~865 KB (246 KB
  gzipped) as a single chunk; Vite warns about this. Acceptable for now,
  worth revisiting with route-based code-splitting once the app grows.
- **Global search input in the topbar is not yet wired to actual filtering.**

## Next up

See `docs/project_flow.md` for the full phased plan — the immediate next
phase is standing up the Django + DRF backend and PostgreSQL schema, then
replacing the Zustand mock store's data source with real API calls one
resource at a time.
