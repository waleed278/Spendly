# Spendly — Product Plan

## Positioning
A personal/family finance tracker covering the standard feature set found in Mint,
YNAB, and PocketGuard, built around a wedge: turning tracking into *decisions*,
not just logs.

## Core features (market-standard)
- Multi-account tracking (bank, cash, card, wallet) with net worth summary
- Transactions: categorized income/expense/transfer, search & filters, tags, notes
- Budgets: per-category monthly budgets with progress
- Goals: savings goals with progress tracking
- Reports/Analytics: category breakdown, trends, income vs expense, cash flow
- Recurring transactions & bill reminders
- Multi-currency support, dark/light theme, notifications, settings/profile

## Differentiators
1. **Financial Health Score** — a single 0–100 score derived from savings rate,
   budget adherence, debt ratio, and spending volatility, with a breakdown view.
2. **What-If Simulator** — sliders to model spending cuts and instantly see the
   effect on savings goal timelines.
3. **Bill Split & IOU Tracker** — shared-expense tracking (Splitwise-style) built
   into the same app.
4. **Subscription Radar** — dedicated view of recurring subscriptions, upcoming
   charges, and cost-creep alerts.
5. **Envelope/Jar Budget Mode** — an alternate visual budgeting view toggleable
   alongside the standard list view.
6. **Spending Streaks** — lightweight gamification (no-spend days, under-budget
   streaks) to reinforce habits.

## Tech stack
- **Frontend** (built first, fully functional on mock data): React 18 + TypeScript
  + Vite, Tailwind CSS, React Router, Zustand, Recharts, Framer Motion,
  React Hook Form + Zod.
- **Backend** (structure only for now): Django + Django REST Framework, JWT
  auth via `djangorestframework-simplejwt`.
- **Database** (structure only for now): PostgreSQL via the Django ORM.

See [`project_flow.md`](project_flow.md) for the full architecture, data
model, API design, and phased build-out plan, and
[`project_overview.md`](project_overview.md) for the expanded product pitch.

## Repo layout
```
Spendly/
  frontend/   # full app, buildable and runnable today
  backend/    # folder scaffold only, no logic/config yet
  database/   # folder scaffold only, no schema/config yet
  docs/       # this plan
```

## Status
Frontend UI is being built against mock/fixture data — no network calls, no auth,
no persistence. Backend and database wiring are intentionally deferred.
