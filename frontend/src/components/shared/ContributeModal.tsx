import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAppStore } from "@/store/app-store";
import type { Goal } from "@/lib/types";

interface ContributeModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export function ContributeModal({ goal, onClose }: ContributeModalProps) {
  const { contributeToGoal } = useAppStore();
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!goal || !amt) return;
    contributeToGoal(goal.id, amt);
    setAmount("");
    onClose();
  }

  return (
    <Modal open={!!goal} onClose={onClose} title={`Add funds to ${goal?.name ?? ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contribute-amount">Amount</Label>
          <Input
            id="contribute-amount"
            type="number"
            min="1"
            step="0.01"
            autoFocus
            required
            placeholder="e.g. 100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Funds</Button>
        </div>
      </form>
    </Modal>
  );
}
