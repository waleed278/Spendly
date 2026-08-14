import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAppStore } from "@/store/app-store";

const AVATAR_COLORS = ["#12b886", "#8b5cf6", "#3b82f6", "#f0a63d", "#f4574c", "#ec4899", "#14b8a6"];

export function SplitExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addSplitExpense } = useAppStore();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [names, setNames] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    const friendNames = names
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    if (!description || !amt || friendNames.length === 0) return;

    const allNames = ["You", ...friendNames];
    const share = Math.round((amt / allNames.length) * 100) / 100;

    addSplitExpense({
      description,
      amount: amt,
      paidBy: "You",
      date: new Date().toISOString(),
      categoryId: "cat-other",
      participants: allNames.map((name, i) => ({
        id: `p-${Date.now()}-${i}`,
        name,
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        share,
        settled: name === "You",
      })),
    });
    setDescription("");
    setAmount("");
    setNames("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Split an Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="split-desc">Description</Label>
          <Input id="split-desc" required placeholder="e.g. Dinner at Nakamura" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="split-amount">Total amount (paid by you)</Label>
          <Input id="split-amount" type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="split-names">Split with (comma-separated names)</Label>
          <Input id="split-names" required placeholder="e.g. Maria, Dev, Lucia" value={names} onChange={(e) => setNames(e.target.value)} />
          <p className="mt-1.5 text-xs text-fg-subtle">Splits equally between you and everyone listed.</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Split</Button>
        </div>
      </form>
    </Modal>
  );
}
