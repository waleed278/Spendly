import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";
import type { TransactionType } from "@/lib/types";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const { categories, accounts, addTransaction } = useAppStore();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState(categories.find((c) => c.kind === "expense")?.id ?? "");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const filteredCategories = categories.filter((c) => c.kind === (type === "income" ? "income" : "expense"));

  function reset() {
    setType("expense");
    setAmount("");
    setMerchant("");
    setNote("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !merchant || !categoryId || !accountId) return;
    addTransaction({
      accountId,
      categoryId,
      type,
      amount: Math.abs(parseFloat(amount)),
      date: new Date(date).toISOString(),
      merchant,
      note: note || undefined,
      tags: [],
    });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(["expense", "income", "transfer"] as TransactionType[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => {
                setType(t);
                setCategoryId(categories.find((c) => c.kind === (t === "income" ? "income" : "expense"))?.id ?? "");
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                type === t
                  ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  : "border-border text-fg-muted hover:bg-bg-subtle"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="merchant">Merchant / Description</Label>
          <Input
            id="merchant"
            required
            placeholder="e.g. Whole Foods"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="account">Account</Label>
            <Select id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Transaction</Button>
        </div>
      </form>
    </Modal>
  );
}
