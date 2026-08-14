import { useMemo, useState } from "react";
import { Plus, CalendarClock, RefreshCcw, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { SubscriptionModal } from "@/components/shared/SubscriptionModal";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

function monthlyEquivalent(sub: Subscription) {
  if (sub.cycle === "monthly") return sub.amount;
  if (sub.cycle === "yearly") return sub.amount / 12;
  return (sub.amount * 52) / 12;
}

export default function Subscriptions() {
  const { subscriptions, toggleSubscriptionStatus } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyTotal = active.reduce((s, sub) => s + monthlyEquivalent(sub), 0);
  const yearlyTotal = monthlyTotal * 12;

  const sorted = useMemo(
    () =>
      [...subscriptions].sort((a, b) => {
        if (a.status !== b.status) return a.status === "active" ? -1 : 1;
        return new Date(a.nextChargeDate).getTime() - new Date(b.nextChargeDate).getTime();
      }),
    [subscriptions]
  );

  const mostExpensive = [...active].sort((a, b) => monthlyEquivalent(b) - monthlyEquivalent(a))[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Subscription Radar</h2>
          <p className="text-sm text-fg-muted">Every recurring charge, in one place.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Subscription
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Monthly total" value={formatCurrency(monthlyTotal)} icon={<RefreshCcw size={18} />} />
        <StatCard label="Yearly projection" value={formatCurrency(yearlyTotal)} icon={<CalendarClock size={18} />} iconBg="bg-accent-500/10 text-accent-600" />
        <StatCard label="Active subscriptions" value={String(active.length)} icon={<CheckCircle size={18} />} iconBg="bg-income/10 text-income" />
      </div>

      {mostExpensive && (
        <Card className="border-warn/30 bg-warn/5 p-4">
          <p className="text-sm text-fg">
            <span className="font-semibold">{mostExpensive.name}</span> is your priciest active subscription at{" "}
            <span className="font-semibold">{formatCurrency(monthlyEquivalent(mostExpensive))}/mo</span>. Renewing{" "}
            {formatRelativeDate(mostExpensive.nextChargeDate).toLowerCase()}.
          </p>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {sorted.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-lg px-2 py-3 hover:bg-bg-subtle sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: s.color, opacity: s.status === "active" ? 1 : 0.4 }}
                >
                  {s.name[0]}
                </div>
                <div>
                  <p className={`text-sm font-medium ${s.status === "active" ? "text-fg" : "text-fg-subtle line-through"}`}>
                    {s.name}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-fg-subtle">
                    <CalendarClock size={11} />
                    {s.status === "active" ? formatRelativeDate(s.nextChargeDate) : "Cancelled"}
                    <Badge tone="neutral" className="px-1.5 py-0 capitalize">{s.cycle}</Badge>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-[52px] sm:pl-0">
                <span className={`text-sm font-semibold ${s.status === "active" ? "text-fg" : "text-fg-subtle"}`}>
                  {formatCurrency(s.amount)}
                </span>
                <Button
                  size="sm"
                  variant={s.status === "active" ? "outline" : "primary"}
                  onClick={() => toggleSubscriptionStatus(s.id)}
                >
                  {s.status === "active" ? (
                    <>
                      <XCircle size={14} /> Cancel
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} /> Reactivate
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <SubscriptionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
