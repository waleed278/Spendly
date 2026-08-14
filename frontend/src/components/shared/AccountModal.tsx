import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";
import type { AccountType } from "@/lib/types";

const TYPE_COLORS: Record<AccountType, string> = {
  bank: "#0a9470",
  cash: "#f0a63d",
  card: "#111827",
  wallet: "#3b82f6",
};

export function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addAccount } = useAppStore();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [balance, setBalance] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    addAccount({
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency: "USD",
      color: TYPE_COLORS[type],
    });
    setName("");
    setBalance("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="acc-name">Account name</Label>
          <Input id="acc-name" required placeholder="e.g. Chase Checking" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="acc-type">Type</Label>
            <Select id="acc-type" value={type} onChange={(e) => setType(e.target.value as AccountType)}>
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="card">Credit Card</option>
              <option value="wallet">Wallet</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="acc-balance">Starting balance</Label>
            <Input id="acc-balance" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Account</Button>
        </div>
      </form>
    </Modal>
  );
}
