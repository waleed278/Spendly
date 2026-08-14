import { useState } from "react";
import { Plus, CalendarDays, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { GoalModal } from "@/components/shared/GoalModal";
import { ContributeModal } from "@/components/shared/ContributeModal";
import { getIcon } from "@/lib/icon-map";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatDate, percentOf } from "@/lib/utils";
import type { Goal } from "@/lib/types";

export default function Goals() {
  const { goals } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [contributing, setContributing] = useState<Goal | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Savings Goals</h2>
          <p className="text-sm text-fg-muted">{goals.length} active goals</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {goals.map((g) => {
          const Icon = getIcon(g.icon);
          const pct = percentOf(g.currentAmount, g.targetAmount);
          const complete = g.currentAmount >= g.targetAmount;
          const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000);

          return (
            <Card key={g.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${g.color}1A`, color: g.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-fg">{g.name}</p>
                    <p className="flex items-center gap-1 text-xs text-fg-subtle">
                      <CalendarDays size={11} />
                      {complete ? "Completed" : daysLeft >= 0 ? `${daysLeft} days left` : "Past deadline"}
                    </p>
                  </div>
                </div>
                {complete && <CheckCircle2 size={20} className="text-income" />}
              </div>

              <div className="mt-5 flex items-center gap-5">
                <ScoreRing value={pct} size={84} strokeWidth={7} color={complete ? "#12b886" : g.color}>
                  <span className="text-sm font-bold text-fg">{Math.round(pct)}%</span>
                </ScoreRing>
                <div className="flex-1">
                  <p className="text-xl font-bold text-fg">{formatCurrency(g.currentAmount)}</p>
                  <p className="text-xs text-fg-subtle">of {formatCurrency(g.targetAmount)} goal</p>
                  <p className="mt-1 text-xs text-fg-subtle">Target: {formatDate(g.deadline, { year: "numeric" })}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-5 w-full"
                disabled={complete}
                onClick={() => setContributing(g)}
              >
                {complete ? "Goal Reached 🎉" : "Add Funds"}
              </Button>
            </Card>
          );
        })}
      </div>

      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ContributeModal goal={contributing} onClose={() => setContributing(null)} />
    </div>
  );
}
