import { useMemo, useState } from "react";
import { Plus, Pencil, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tabs } from "@/components/ui/Tabs";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { getIcon } from "@/lib/icon-map";
import { BudgetModal } from "@/components/shared/BudgetModal";
import { useAppStore } from "@/store/app-store";
import { budgetSpend } from "@/lib/selectors";
import { formatCurrency, percentOf, cn } from "@/lib/utils";
import type { Budget } from "@/lib/types";

export default function Budgets() {
  const { budgets, categories, transactions } = useAppStore();
  const [view, setView] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const rows = useMemo(
    () =>
      budgets.map((b) => {
        const spent = budgetSpend(transactions, b);
        return { ...b, spent, pct: percentOf(spent, b.limit), category: categories.find((c) => c.id === b.categoryId)! };
      }),
    [budgets, transactions, categories]
  );

  const totalLimit = rows.reduce((s, r) => s + r.limit, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);

  function openEdit(b: Budget) {
    setEditing(b);
    setModalOpen(true);
  }
  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Budgets</h2>
          <p className="text-sm text-fg-muted">
            {formatCurrency(totalSpent)} spent of {formatCurrency(totalLimit)} budgeted this month
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: "list", label: "List" },
              { id: "jar", label: "Jar Mode" },
            ]}
            active={view}
            onChange={setView}
          />
          <Button onClick={openAdd}>
            <Plus size={16} /> New Budget
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const over = r.pct >= 100;
            return (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon icon={r.category.icon} color={r.category.color} />
                    <div>
                      <p className="font-medium text-fg">{r.category.name}</p>
                      <p className="text-xs text-fg-subtle">Monthly budget</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(r)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-subtle hover:bg-bg-subtle hover:text-fg"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-fg">{formatCurrency(r.spent)}</span>
                    <span className="text-sm text-fg-subtle">of {formatCurrency(r.limit)}</span>
                  </div>
                  <ProgressBar value={r.pct} color={over ? "#f4574c" : r.pct >= 80 ? "#f0a63d" : r.category.color} />
                  {over ? (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-expense">
                      <AlertTriangle size={12} /> {formatCurrency(r.spent - r.limit)} over budget
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-fg-subtle">{formatCurrency(r.limit - r.spent)} remaining</p>
                  )}
                </div>
              </Card>
            );
          })}
          {rows.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-fg-muted">
              No budgets yet. Create one to start tracking.
            </p>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map((r) => {
              const Icon = getIcon(r.category.icon);
              const fillPct = Math.min(100, r.pct);
              const over = r.pct >= 100;
              return (
                <div key={r.id} className="flex flex-col items-center gap-2">
                  <div className="relative h-32 w-20 overflow-hidden rounded-b-2xl rounded-t-lg border-2 border-border bg-bg-subtle">
                    <div
                      className={cn("absolute bottom-0 left-0 right-0 transition-all duration-700")}
                      style={{ height: `${fillPct}%`, backgroundColor: over ? "#f4574c" : r.category.color, opacity: 0.85 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-bg-raised/90 p-1.5 shadow-sm">
                        <Icon size={16} style={{ color: r.category.color }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs font-medium text-fg">{r.category.name}</p>
                  <p className={cn("text-[11px] font-semibold", over ? "text-expense" : "text-fg-subtle")}>
                    {Math.round(r.pct)}% full
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <BudgetModal open={modalOpen} onClose={() => setModalOpen(false)} editingBudget={editing} />
    </div>
  );
}
