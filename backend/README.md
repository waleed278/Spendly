# Spendly API (scaffold only)

Structure reserved for the backend service. Nothing is implemented or configured yet —
no dependencies, no server code. This is intentional: the frontend was built
first against mock data.

## Planned stack
Django + Django REST Framework, PostgreSQL, JWT auth via
`djangorestframework-simplejwt`. See [`../docs/project_flow.md`](../docs/project_flow.md)
for the full tech stack, API design, and the phased build-out plan.

## Planned folder layout

```
backend/
  manage.py
  config/                 # project package: settings, root urls, wsgi/asgi
  apps/
    users/                # custom User model, registration/login/me
    finance/               # Account, Category, Transaction, Budget, Goal
    subscriptions/          # Subscription
    splits/                 # SplitExpense, SplitParticipant (bill splitting/IOU)
    notifications/           # AppNotification
    insights/                # health-score + what-if simulator + reports endpoints
    core/                    # shared abstract base models, permissions, pagination
  requirements/
  Dockerfile
  .env.example
```

## Planned resource groups (mirrors the frontend)
auth, accounts, transactions, categories, budgets, goals, reports,
subscriptions, splits (bill splitting/IOU), simulator, notifications, settings.
