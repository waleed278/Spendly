# Spendly Database (scaffold only)

Structure reserved for database-related assets that live outside the Django
project itself. No schema, migrations, or connection config exist yet — this
is intentional, added only when backend integration begins.

## Planned stack
PostgreSQL, managed through the Django ORM (see `../backend/`). Django keeps
migrations inside each app (`backend/apps/*/migrations/`), not here — this
folder holds cross-cutting database assets instead: seed/fixture data and
schema reference docs. See [`../docs/project_flow.md`](../docs/project_flow.md)
for the full data model (models: User, Account, Category, Transaction,
Budget, Goal, Subscription, SplitExpense, SplitParticipant, Notification).

## Folder layout

```
seeds/      # fixture / seed data for local & CI databases
docs/       # ER diagrams or schema notes, if kept separate from docs/project_flow.md
```
