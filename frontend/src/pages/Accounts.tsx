import { useState } from "react";
import { Plus, Landmark, Wallet, CreditCard, Banknote, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { AccountModal } from "@/components/shared/AccountModal";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/utils";
import type { AccountType } from "@/lib/types";

const TYPE_META: Record<AccountType, { label: string; icon: typeof Landmark }> = {
  bank: { label: "Bank Accounts", icon: Landmark },
  cash: { label: "Cash", icon: Banknote },
  card: { label: "Credit Cards", icon: CreditCard },
  wallet: { label: "Wallets", icon: Wallet },
};

export default function Accounts() {
  const { accounts } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const netWorth = accounts.reduce((s, a) => s + a.balance, 0);
  const assets = accounts.filter((a) => a.balance >= 0).reduce((s, a) => s + a.balance, 0);
  const liabilities = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0);

  const grouped = (Object.keys(TYPE_META) as AccountType[]).map((type) => ({
    type,
    accounts: accounts.filter((a) => a.type === type),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-fg">Accounts</h2>
          <p className="text-sm text-fg-muted">{accounts.length} accounts connected</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium text-fg-muted">Net Worth</p>
          <p className="mt-2 text-2xl font-bold text-fg">{formatCurrency(netWorth)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-fg-muted">Total Assets</p>
          <p className="mt-2 text-2xl font-bold text-income">{formatCurrency(assets)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-fg-muted">Total Liabilities</p>
          <p className="mt-2 text-2xl font-bold text-expense">{formatCurrency(liabilities)}</p>
        </Card>
      </div>

      {grouped.map((group) => {
        if (group.accounts.length === 0) return null;
        const GroupIcon = TYPE_META[group.type].icon;
        return (
          <div key={group.type}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg-muted">
              <GroupIcon size={15} />
              {TYPE_META[group.type].label}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.accounts.map((a) => {
                const AccIcon = TYPE_META[a.type].icon;
                return (
                  <Card key={a.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: a.color }}
                      >
                        <AccIcon size={17} />
                      </div>
                      <Dropdown
                        trigger={
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-subtle hover:bg-bg-subtle">
                            <MoreVertical size={14} />
                          </button>
                        }
                        className="w-40"
                      >
                        {() => (
                          <>
                            <DropdownItem>View transactions</DropdownItem>
                            <DropdownItem>Edit account</DropdownItem>
                            <DropdownItem className="text-expense">Remove</DropdownItem>
                          </>
                        )}
                      </Dropdown>
                    </div>
                    <p className="mt-4 font-medium text-fg">{a.name}</p>
                    <p className="text-xs text-fg-subtle">
                      {a.institution ?? TYPE_META[a.type].label}
                      {a.last4 ? ` •••• ${a.last4}` : ""}
                    </p>
                    <p className={`mt-3 text-xl font-bold ${a.balance < 0 ? "text-expense" : "text-fg"}`}>
                      {formatCurrencyPrecise(a.balance)}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      <AccountModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
