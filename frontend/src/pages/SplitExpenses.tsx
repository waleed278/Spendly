import { useMemo, useState } from "react";
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { SplitExpenseModal } from "@/components/shared/SplitExpenseModal";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SplitExpenses() {
  const { splitExpenses, settleSplitParticipant } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const { youAreOwed, youOwe } = useMemo(() => {
    let owed = 0;
    let owe = 0;
    for (const split of splitExpenses) {
      if (split.paidBy === "You") {
        owed += split.participants
          .filter((p) => p.name !== "You" && !p.settled)
          .reduce((s, p) => s + p.share, 0);
      } else {
        const you = split.participants.find((p) => p.name === "You");
        if (you && !you.settled) owe += you.share;
      }
    }
    return { youAreOwed: owed, youOwe: owe };
  }, [splitExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Split & IOU</h2>
          <p className="text-sm text-fg-muted">Track shared expenses without a second app.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Split
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="You are owed"
          value={formatCurrency(youAreOwed)}
          icon={<ArrowDownLeft size={18} />}
          iconBg="bg-income/10 text-income"
        />
        <StatCard
          label="You owe"
          value={formatCurrency(youOwe)}
          icon={<ArrowUpRight size={18} />}
          iconBg="bg-expense/10 text-expense"
        />
      </div>

      <div className="space-y-4">
        {splitExpenses.map((split) => {
          const settledCount = split.participants.filter((p) => p.settled).length;
          const allSettled = settledCount === split.participants.length;
          return (
            <Card key={split.id} className="p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-fg">{split.description}</p>
                  <p className="text-xs text-fg-subtle">
                    {formatDate(split.date, { year: "numeric" })} · Paid by {split.paidBy}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-fg">{formatCurrency(split.amount)}</span>
                  <Badge tone={allSettled ? "success" : "warn"}>{allSettled ? "Settled" : `${settledCount}/${split.participants.length} settled`}</Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {split.participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} color={p.avatarColor} size={28} />
                      <span className="text-sm text-fg">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-fg-muted">{formatCurrency(p.share)}</span>
                      <button
                        onClick={() => settleSplitParticipant(split.id, p.id)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.settled ? "bg-income/10 text-income" : "bg-bg-subtle text-fg-muted hover:bg-warn/10 hover:text-warn"
                        }`}
                      >
                        {p.settled ? "Settled" : "Mark settled"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
        {splitExpenses.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-fg-muted">No shared expenses yet.</CardContent>
          </Card>
        )}
      </div>

      <SplitExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
