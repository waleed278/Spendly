import { useMemo, useState } from "react";
import { Search, Plus, Trash2, ArrowUpDown, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { AddTransactionModal } from "@/components/shared/AddTransactionModal";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionType } from "@/lib/types";

type SortKey = "date" | "amount";

export default function Transactions() {
  const { transactions, categories, accounts, deleteTransaction } = useAppStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      if (search && !t.merchant.toLowerCase().includes(search.toLowerCase()) && !(t.note ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false;
      if (accountFilter !== "all" && t.accountId !== accountFilter) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
      return (a.amount - b.amount) * dir;
    });
    return result;
  }, [transactions, search, categoryFilter, accountFilter, typeFilter, sortKey, sortDir]);

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const hasFilters = search || categoryFilter !== "all" || accountFilter !== "all" || typeFilter !== "all";

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setAccountFilter("all");
    setTypeFilter("all");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Transactions</h2>
          <p className="text-sm text-fg-muted">
            {filtered.length} results · {formatCurrency(totalIncome)} in · {formatCurrency(totalExpense)} out
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Input
              icon={<Search size={15} />}
              placeholder="Search merchant or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TransactionType | "all")}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
            <option value="all">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-fg"
          >
            <X size={13} /> Clear filters
          </button>
        )}
      </Card>

      <Card className="overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden grid-cols-[1fr,140px,140px,120px,40px] gap-3 border-b border-border px-5 py-3 text-xs font-medium text-fg-subtle lg:grid">
          <span>Transaction</span>
          <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-fg">
            Date <ArrowUpDown size={11} />
          </button>
          <span>Account</span>
          <button onClick={() => toggleSort("amount")} className="flex items-center justify-end gap-1 hover:text-fg">
            Amount <ArrowUpDown size={11} />
          </button>
          <span />
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-fg-muted">No transactions match your filters.</p>
          )}
          {filtered.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId)!;
            const acc = accounts.find((a) => a.id === t.accountId)!;
            return (
              <div
                key={t.id}
                className="group grid grid-cols-1 items-center gap-2 px-5 py-3.5 hover:bg-bg-subtle lg:grid-cols-[1fr,140px,140px,120px,40px] lg:gap-3"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{t.merchant}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Badge tone="neutral" className="px-1.5 py-0">{cat.name}</Badge>
                      {t.tags.map((tag) => (
                        <Badge key={tag} tone="brand" className="px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-fg-muted lg:text-left">{formatDate(t.date, { year: "numeric" })}</span>
                <span className="flex items-center gap-1.5 text-sm text-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: acc.color }} />
                  {acc.name}
                </span>
                <span
                  className={`text-right text-sm font-semibold lg:text-right ${
                    t.type === "income" ? "text-income" : t.type === "transfer" ? "text-fg" : "text-fg"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="flex h-8 w-8 items-center justify-center justify-self-end rounded-lg text-fg-subtle opacity-0 hover:bg-expense/10 hover:text-expense group-hover:opacity-100"
                  title="Delete transaction"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
