import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";
import type { Budget } from "@/lib/types";

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  editingBudget?: Budget | null;
}

export function BudgetModal({ open, onClose, editingBudget }: BudgetModalProps) {
  const { categories, budgets, addBudget, updateBudgetLimit } = useAppStore();
  const usedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const availableCategories = categories.filter(
    (c) => c.kind === "expense" && (!usedCategoryIds.has(c.id) || c.id === editingBudget?.categoryId)
  );

  const [categoryId, setCategoryId] = useState(editingBudget?.categoryId ?? availableCategories[0]?.id ?? "");
  const [limit, setLimit] = useState(editingBudget ? String(editingBudget.limit) : "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const limitNum = parseFloat(limit);
    if (!categoryId || !limitNum) return;
    if (editingBudget) {
      updateBudgetLimit(editingBudget.id, limitNum);
    } else {
      addBudget({ categoryId, limit: limitNum, period: "monthly" });
    }
    setLimit("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editingBudget ? "Edit Budget" : "New Budget"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="budget-category">Category</Label>
          <Select
            id="budget-category"
            value={categoryId}
            disabled={!!editingBudget}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="budget-limit">Monthly limit</Label>
          <Input
            id="budget-limit"
            type="number"
            min="1"
            step="1"
            required
            placeholder="e.g. 400"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingBudget ? "Save Changes" : "Create Budget"}</Button>
        </div>
      </form>
    </Modal>
  );
}
