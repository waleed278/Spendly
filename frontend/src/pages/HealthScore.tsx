import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PiggyBank, TrendingDown, Target, Activity, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { useAppStore } from "@/store/app-store";
import { computeHealthScore, scoreLabel } from "@/lib/health-score";
import { monthLabel } from "@/lib/selectors";

const SUB_SCORES = [
  { key: "savingsRate" as const, label: "Savings Rate", icon: PiggyBank, desc: "How much of your income you keep each month." },
  { key: "budgetAdherence" as const, label: "Budget Adherence", icon: Target, desc: "How closely you stay within your category budgets." },
  { key: "debtRatio" as const, label: "Debt Ratio", icon: TrendingDown, desc: "How your spending compares to income — lower is safer." },
  { key: "consistency" as const, label: "Consistency", icon: Activity, desc: "How stable your monthly spending is over time." },
];

export default function HealthScore() {
  const { transactions, budgets } = useAppStore();

  const health = useMemo(() => computeHealthScore(transactions, budgets, 0), [transactions, budgets]);
  const tone = scoreLabel(health.overall);

  const history = useMemo(
    () =>
      [5, 4, 3, 2, 1, 0].map((m) => ({
        month: monthLabel(m),
        score: computeHealthScore(transactions, budgets, m).overall,
      })),
    [transactions, budgets]
  );

  const tips = useMemo(() => {
    const list: string[] = [];
    if (health.savingsRate < 60) list.push("Try automating a transfer to savings right after payday to lift your savings rate.");
    if (health.budgetAdherence < 70) list.push("A couple of categories are running over budget — check the Budgets page and adjust limits or spending.");
    if (health.debtRatio < 60) list.push("Your expenses are taking up a large share of income — look for recurring costs to trim.");
    if (health.consistency < 70) list.push("Your spending swings a lot month to month — smoothing out big one-off purchases will help.");
    if (list.length === 0) list.push("You're in great shape across the board — keep doing what you're doing.");
    return list;
  }, [health]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-fg">Financial Health Score</h2>
        <p className="text-sm text-fg-muted">A single number that summarizes how healthy your finances are right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <ScoreRing value={health.overall} size={180} strokeWidth={14} color={tone.color}>
            <div>
              <p className="text-5xl font-bold text-fg">{health.overall}</p>
              <p className="text-xs text-fg-subtle">out of 100</p>
            </div>
          </ScoreRing>
          <Badge className="mt-4" style={{ backgroundColor: `${tone.color}1A`, color: tone.color }}>
            {tone.label}
          </Badge>
          <p className="mt-4 text-sm text-fg-muted">
            Weighted from savings rate (35%), budget adherence (30%), debt ratio (20%), and consistency (15%).
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c9894" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#8c9894" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line type="monotone" dataKey="score" stroke={tone.color} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SUB_SCORES.map((s) => (
          <Card key={s.key} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <s.icon size={18} />
              </div>
              <div>
                <p className="font-medium text-fg">{s.label}</p>
                <p className="text-xs text-fg-subtle">{s.desc}</p>
              </div>
              <span className="ml-auto text-lg font-bold text-fg">{health[s.key]}</span>
            </div>
            <ProgressBar
              className="mt-4"
              value={health[s.key]}
              color={health[s.key] >= 70 ? "#12b886" : health[s.key] >= 50 ? "#f0a63d" : "#f4574c"}
            />
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <Lightbulb size={15} className="text-accent-500" /> How to improve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-lg bg-bg-subtle p-3 text-sm text-fg-muted">
              {tip}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
