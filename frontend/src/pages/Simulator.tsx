import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useAppStore } from "@/store/app-store";
import { categoryBreakdown, sumByType, isSameMonth } from "@/lib/selectors";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";

export default function Simulator() {
  const { transactions, categories, goals } = useAppStore();
  const [goalId, setGoalId] = useState(goals[0]?.id ?? "");
  const [cuts, setCuts] = useState<Record<string, number>>({});

  const thisMonthTxns = transactions.filter((t) => isSameMonth(t.date, 0));
  const income = sumByType(thisMonthTxns, "income");
  const breakdown = useMemo(() => categoryBreakdown(transactions, 0).slice(0, 6), [transactions]);

  const goal = goals.find((g) => g.id === goalId);

  const baselineExpense = breakdown.reduce((s, b) => s + b.total, 0);
  const simulatedExpense = breakdown.reduce((s, b) => s + b.total * (1 - (cuts[b.categoryId] ?? 0) / 100), 0);

  const baselineSavings = Math.max(income - baselineExpense, 0);
  const simulatedSavings = Math.max(income - simulatedExpense, 0);

  function monthsToGoal(monthlySavings: number) {
    if (!goal) return null;
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 0;
    if (monthlySavings <= 0) return null;
    return Math.ceil(remaining / monthlySavings);
  }

  const baselineMonths = monthsToGoal(baselineSavings);
  const simulatedMonths = monthsToGoal(simulatedSavings);

  const projection = useMemo(() => {
    if (!goal) return [];
    const horizon = Math.max(baselineMonths ?? 12, simulatedMonths ?? 12, 6);
    const data = [];
    for (let m = 0; m <= Math.min(horizon, 36); m++) {
      data.push({
        month: `M${m}`,
        baseline: Math.min(goal.currentAmount + baselineSavings * m, goal.targetAmount),
        simulated: Math.min(goal.currentAmount + simulatedSavings * m, goal.targetAmount),
        target: goal.targetAmount,
      });
    }
    return data;
  }, [goal, baselineSavings, simulatedSavings, baselineMonths, simulatedMonths]);

  const monthsSaved = baselineMonths != null && simulatedMonths != null ? baselineMonths - simulatedMonths : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-fg">What-If Simulator</h2>
        <p className="text-sm text-fg-muted">Drag the sliders to see how cutting spend changes your goal timeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <SlidersHorizontal size={15} /> Adjust Spending
            </CardTitle>
            <button
              onClick={() => setCuts({})}
              className="flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-fg"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-muted">Simulating toward</label>
              <Select value={goalId} onChange={(e) => setGoalId(e.target.value)}>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Select>
            </div>

            {breakdown.map((b) => {
              const cat = categories.find((c) => c.id === b.categoryId)!;
              const cut = cuts[b.categoryId] ?? 0;
              return (
                <div key={b.categoryId}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-fg">
                      <CategoryIcon icon={cat.icon} color={cat.color} size={13} />
                      {cat.name}
                    </span>
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">-{cut}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={cut}
                    onChange={(e) => setCuts((c) => ({ ...c, [b.categoryId]: Number(e.target.value) }))}
                    className="w-full accent-brand-600"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-fg-subtle">
                    <span>{formatCurrency(b.total)}</span>
                    <span>{formatCurrency(b.total * (1 - cut / 100))}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-medium text-fg-muted">Monthly savings today</p>
              <p className="mt-2 text-xl font-bold text-fg">{formatCurrency(baselineSavings)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium text-fg-muted">Monthly savings simulated</p>
              <p className="mt-2 text-xl font-bold text-income">{formatCurrency(simulatedSavings)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium text-fg-muted">Time saved reaching goal</p>
              <p className="mt-2 text-xl font-bold text-accent-600">
                {monthsSaved != null ? `${Math.max(monthsSaved, 0)} mo` : "—"}
              </p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{goal ? `Projected path to "${goal.name}"` : "Select a goal"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={projection} margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8c9894" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#8c9894" }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tickFormatter={(v: number) => formatCurrencyCompact(v)}
                  />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" name="Current pace" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="simulated" name="With cuts" stroke="#12b886" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="target" name="Goal" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-fg-subtle">
                {goal && simulatedMonths != null
                  ? `At this rate, you'd reach "${goal.name}" in ~${simulatedMonths} months.`
                  : "Increase savings to see a projected payoff date."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
