import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { useAppStore } from "@/store/app-store";
import { computeHealthScore, scoreLabel } from "@/lib/health-score";
import { monthlyTrend, categoryBreakdown, sumByType, isSameMonth, budgetSpend } from "@/lib/selectors";
import { formatCurrency, formatCurrencyCompact, formatRelativeDate, percentOf } from "@/lib/utils";

export default function Dashboard() {
  const { accounts, transactions, budgets, categories, subscriptions } = useAppStore();

  const netWorth = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);
  const thisMonthTxns = useMemo(() => transactions.filter((t) => isSameMonth(t.date, 0)), [transactions]);
  const income = sumByType(thisMonthTxns, "income");
  const expense = sumByType(thisMonthTxns, "expense");
  const saved = income - expense;
  const lastMonthTxns = useMemo(() => transactions.filter((t) => isSameMonth(t.date, 1)), [transactions]);
  const lastExpense = sumByType(lastMonthTxns, "expense");
  const expenseDelta = lastExpense > 0 ? ((expense - lastExpense) / lastExpense) * 100 : 0;

  const trend = useMemo(() => monthlyTrend(transactions, 6), [transactions]);
  const breakdown = useMemo(() => categoryBreakdown(transactions, 0).slice(0, 6), [transactions]);
  const health = useMemo(() => computeHealthScore(transactions, budgets), [transactions, budgets]);
  const scoreTone = scoreLabel(health.overall);

  const topBudgets = useMemo(
    () =>
      budgets
        .map((b) => ({ ...b, spent: budgetSpend(transactions, b) }))
        .sort((a, b) => percentOf(b.spent, b.limit) - percentOf(a.spent, a.limit))
        .slice(0, 4),
    [budgets, transactions]
  );

  const recentTxns = transactions.slice(0, 6);

  const upcomingBills = useMemo(
    () =>
      subscriptions
        .filter((s) => s.status === "active")
        .sort((a, b) => new Date(a.nextChargeDate).getTime() - new Date(b.nextChargeDate).getTime())
        .slice(0, 4),
    [subscriptions]
  );

  const insights = useMemo(() => {
    const items: string[] = [];
    if (expenseDelta > 10) items.push(`Spending is up ${expenseDelta.toFixed(0)}% vs. last month — worth a look.`);
    else if (expenseDelta < -5) items.push(`Nice — spending is down ${Math.abs(expenseDelta).toFixed(0)}% vs. last month.`);
    if (breakdown[0]) {
      const cat = categories.find((c) => c.id === breakdown[0].categoryId);
      items.push(`${cat?.name ?? "Top category"} is your biggest spend this month at ${formatCurrency(breakdown[0].total)}.`);
    }
    if (saved > 0) items.push(`You're on track to save ${formatCurrency(saved)} this month.`);
    else items.push(`You've spent more than you've earned this month — consider reviewing budgets.`);
    return items;
  }, [expenseDelta, breakdown, categories, saved]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Welcome back, Alex 👋</h2>
          <p className="text-sm text-fg-muted">Here's what's happening with your money this month.</p>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Net Worth" value={formatCurrency(netWorth)} icon={<Wallet size={19} />} />
        <StatCard
          label="Income (this month)"
          value={formatCurrency(income)}
          icon={<TrendingUp size={19} />}
          iconBg="bg-income/10 text-income"
        />
        <StatCard
          label="Expenses (this month)"
          value={formatCurrency(expense)}
          icon={<TrendingDown size={19} />}
          iconBg="bg-expense/10 text-expense"
          trend={{
            value: `${expenseDelta >= 0 ? "+" : ""}${expenseDelta.toFixed(0)}% vs last month`,
            positive: expenseDelta <= 0,
          }}
        />
        <StatCard
          label="Saved (this month)"
          value={formatCurrency(saved)}
          icon={<PiggyBank size={19} />}
          iconBg="bg-accent-500/10 text-accent-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <Badge tone="brand">Last 6 months</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend} margin={{ left: 0, top: 10 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12b886" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#12b886" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f4574c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f4574c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c9894" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#8c9894" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v: number) => formatCurrencyCompact(v)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 12, border: "1px solid rgb(var(--border))", background: "rgb(var(--bg-raised))" }}
                />
                <Area type="monotone" dataKey="income" stroke="#12b886" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#f4574c" fill="url(#expenseGrad)" strokeWidth={2} name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health score */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <ScoreRing value={health.overall} color={scoreTone.color} size={132}>
              <div>
                <p className="text-3xl font-bold text-fg">{health.overall}</p>
                <p className="text-[11px] text-fg-subtle">/ 100</p>
              </div>
            </ScoreRing>
            <Badge className="mt-3" tone="brand" style={{ color: scoreTone.color }}>
              {scoreTone.label}
            </Badge>
            <p className="mt-3 text-xs text-fg-muted">
              Savings rate, budget adherence, debt ratio & consistency combined.
            </p>
            <Link
              to="/app/health-score"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              See full breakdown <ArrowRight size={13} />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="total"
                    nameKey="categoryId"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {breakdown.map((b) => (
                      <Cell key={b.categoryId} fill={categories.find((c) => c.id === b.categoryId)?.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {breakdown.slice(0, 4).map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId)!;
                return (
                  <div key={b.categoryId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-fg-muted">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-medium text-fg">{formatCurrency(b.total)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <Link to="/app/budgets" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBudgets.map((b) => {
              const cat = categories.find((c) => c.id === b.categoryId)!;
              const pct = percentOf(b.spent, b.limit);
              return (
                <div key={b.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-fg-muted">{cat.name}</span>
                    <span className="font-medium text-fg">
                      {formatCurrency(b.spent)} <span className="text-fg-subtle">/ {formatCurrency(b.limit)}</span>
                    </span>
                  </div>
                  <ProgressBar value={pct} color={pct >= 100 ? "#f4574c" : pct >= 80 ? "#f0a63d" : cat.color} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming bills */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
            <Link to="/app/subscriptions" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBills.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-fg">{s.name}</p>
                    <p className="flex items-center gap-1 text-xs text-fg-subtle">
                      <CalendarClock size={11} /> {formatRelativeDate(s.nextChargeDate)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-fg">{formatCurrency(s.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/app/transactions" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentTxns.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId)!;
              return (
                <div key={t.id} className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-bg-subtle">
                  <div className="flex items-center gap-3">
                    <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
                    <div>
                      <p className="text-sm font-medium text-fg">{t.merchant}</p>
                      <p className="text-xs text-fg-subtle">
                        {cat.name} · {formatRelativeDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === "income" ? "text-income" : "text-fg"}`}>
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-accent-500" /> Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="rounded-lg bg-bg-subtle p-3 text-sm text-fg-muted">
                {insight}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
