import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useAppStore } from "@/store/app-store";
import { monthlyTrend, categoryBreakdown } from "@/lib/selectors";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";

export default function Reports() {
  const { transactions, categories } = useAppStore();
  const [range, setRange] = useState("6");

  const trend = useMemo(() => monthlyTrend(transactions, Number(range)), [transactions, range]);
  const cashFlow = useMemo(() => trend.map((t) => ({ month: t.month, net: t.income - t.expense })), [trend]);
  const breakdown = useMemo(() => categoryBreakdown(transactions, 0), [transactions]);
  const totalExpense = breakdown.reduce((s, b) => s + b.total, 0);

  const topMerchants = useMemo(() => {
    const totals = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => totals.set(t.merchant, (totals.get(t.merchant) ?? 0) + t.amount));
    return Array.from(totals.entries())
      .map(([merchant, total]) => ({ merchant, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Reports & Analytics</h2>
          <p className="text-sm text-fg-muted">Deep dive into trends and where your money goes.</p>
        </div>
        <Tabs
          tabs={[
            { id: "3", label: "3M" },
            { id: "6", label: "6M" },
            { id: "12", label: "12M" },
          ]}
          active={range}
          onChange={setRange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trend} margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c9894" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: "#8c9894" }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v: number) => formatCurrencyCompact(v)}
              />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#12b886" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f4574c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category (this month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={breakdown} dataKey="total" nameKey="categoryId" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {breakdown.map((b) => (
                      <Cell key={b.categoryId} fill={categories.find((c) => c.id === b.categoryId)?.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 max-h-52 space-y-2 overflow-y-auto scrollbar-thin">
              {breakdown.map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId)!;
                return (
                  <div key={b.categoryId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-fg-muted">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-medium text-fg">
                      {formatCurrency(b.total)}{" "}
                      <span className="text-fg-subtle">({Math.round((b.total / totalExpense) * 100)}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cashFlow} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8c9894" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#8c9894" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v: number) => formatCurrencyCompact(v)}
                />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12 }} />
                <Line type="monotone" dataKey="net" name="Net" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-xs text-fg-subtle">
              Positive months mean you saved more than you spent.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {topMerchants.map((m, i) => (
            <div key={m.merchant} className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-bg-subtle">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bg-subtle text-xs font-semibold text-fg-muted">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-fg">{m.merchant}</span>
              </div>
              <span className="text-sm font-semibold text-fg">{formatCurrency(m.total)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
