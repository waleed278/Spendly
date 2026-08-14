# Spendly — Project Overview

## What is Spendly?

Spendly is a personal and family finance tracker. It covers the feature set
users already expect from apps like Mint, YNAB, or PocketGuard — accounts,
transactions, budgets, goals, reports — but it's built around one core idea:

> **Tracking spending is not the same as understanding it, and understanding
> it is not the same as acting on it.** Most expense trackers stop at the
> first step. Spendly is designed to carry the user through all three.

Most trackers show you a pie chart of last month's spending and leave you to
draw your own conclusions. Spendly turns that data into a score you can
watch move, a simulation you can play with before committing to a change, and
shared-expense math you don't have to do by hand.

## The problem

People who try to track their spending run into the same wall regardless of
which app they use:

- **Fragmentation** — budgeting lives in one app, subscriptions get tracked
  (or not) in another, and splitting a dinner bill with friends means a third
  app (Splitwise) entirely. Nothing talks to anything else.
- **Data without judgment** — a category breakdown tells you *what* happened,
  not whether it's *good or bad*, or what a specific change would actually do
  to your ability to hit a savings goal.
- **Passive tracking** — logging a transaction is backward-looking. Almost no
  mainstream tracker helps a user decide what to do *next*.
- **Subscription creep** — recurring charges are the easiest spending to lose
  track of because they never show up as a deliberate decision.

## Who it's for

- Individuals who want a single home for budgets, goals, and reports instead
  of juggling a spreadsheet plus two or three apps.
- Roommates, couples, and friend groups who split rent, trips, or dinners
  regularly and are tired of maintaining a separate IOU app.
- Subscription-heavy users (streaming, SaaS, gym, cloud storage) who want to
  see total recurring burn in one place instead of discovering it a charge at
  a time.
- Anyone who responds better to "if I cut X, I save Y and reach my goal Z
  months sooner" than to a static bar chart.

## Core feature set (market-standard, table stakes)

These are the features any credible expense tracker needs, and Spendly has
all of them:

| Feature | Description |
|---|---|
| Multi-account tracking | Bank, cash, card, and wallet accounts with a net worth summary |
| Transactions | Categorized income / expense / transfer entries with tags, notes, search & filters |
| Budgets | Per-category monthly limits with progress tracking and overspend alerts |
| Goals | Savings goals with target amounts, deadlines, and progress |
| Reports & analytics | Category breakdowns, income vs. expense trends, cash flow, top merchants |
| Recurring transactions & bill reminders | Upcoming charges surfaced before they hit |
| Multi-currency, dark/light theme, notifications, settings/profile | Standard app-quality expectations |

## What makes Spendly different

Six features that are either missing from mainstream trackers entirely, or
normally require a second/third app:

### 1. Financial Health Score
A single 0–100 score computed from four weighted inputs — savings rate (35%),
budget adherence (30%), debt ratio (20%), and spending consistency (15%) —
with a full breakdown and a historical trend line. Most apps give you data;
this gives you a number you can watch improve, the same way a credit score
turns a pile of financial facts into one trackable metric.

### 2. What-If Simulator
Interactive sliders per spending category. Drag "cut dining 20%" and
immediately see the projected effect on monthly savings and on the timeline
to a specific goal, plotted as a current-pace-vs-simulated-pace chart. This
turns budgeting from a retrospective report into a forward-looking planning
tool — the thing a spreadsheet power-user builds for themselves manually, but
built into the product.

### 3. Bill Split & IOU Tracker
Splitwise-style shared-expense tracking (who paid, who owes what, settle-up
status) lives inside the same app as personal budgeting, instead of forcing
users to reconcile a second, disconnected tool.

### 4. Subscription Radar
A dedicated view of every recurring charge — monthly/yearly cost normalized
to a comparable monthly figure, next charge dates, and an alert for the
priciest active subscription. Aimed directly at the subscription-creep
problem that generic transaction lists hide.

### 5. Envelope/Jar Budget Mode
An alternate, visual budgeting view (fillable "jars" per category) toggleable
alongside the standard list view — the classic cash-envelope method made
digital, for users who think in containers rather than progress bars.

### 6. Spending Streaks *(planned)*
Lightweight gamification — no-spend-day streaks, under-budget streaks — to
reinforce good habits without turning the app into a game.

## Competitive framing

| | Mint / PocketGuard-style trackers | Splitwise | Rocket Money / Truebill-style subscription trackers | **Spendly** |
|---|---|---|---|---|
| Budgets, goals, reports | Yes | No | No | Yes |
| Shared expense / IOU tracking | No | Yes | No | Yes |
| Subscription-specific view | Partial | No | Yes | Yes |
| Single health score | No | No | No | Yes |
| Forward-looking "what-if" planning | No | No | No | Yes |

The bet is that bundling the shared-expense and subscription-tracking
use cases into the core budgeting app — and adding a score and a simulator on
top — removes the need for the two or three extra apps a financially
organized person currently maintains.

## Current status

The product is in active development. The frontend UI is fully built and
running against mock/fixture data (see `progress.md` for what's implemented).
Backend and database work — a Django + Django REST Framework API backed by
PostgreSQL — is planned next (see `project_flow.md` for the phased roadmap).
