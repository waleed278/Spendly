import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";
import type { SubscriptionCycle } from "@/lib/types";

const PALETTE = ["#0a9470", "#3b82f6", "#8b5cf6", "#f0a63d", "#ec4899", "#ef4444", "#14b8a6"];

export function SubscriptionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addSubscription, categories } = useAppStore();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<SubscriptionCycle>("monthly");
  const [categoryId, setCategoryId] = useState("cat-subscriptions");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!name || !amt) return;
    addSubscription({
      name,
      icon: "RefreshCcw",
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      amount: amt,
      cycle,
      nextChargeDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      categoryId,
      status: "active",
    });
    setName("");
    setAmount("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="sub-name">Service name</Label>
          <Input id="sub-name" required placeholder="e.g. Disney+" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sub-amount">Amount</Label>
            <Input id="sub-amount" type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sub-cycle">Billing cycle</Label>
            <Select id="sub-cycle" value={cycle} onChange={(e) => setCycle(e.target.value as SubscriptionCycle)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="sub-category">Category</Label>
          <Select id="sub-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.filter((c) => c.kind === "expense").map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Subscription</Button>
        </div>
      </form>
    </Modal>
  );
}
