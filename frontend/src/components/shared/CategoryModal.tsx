import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";
import type { CategoryKind } from "@/lib/types";

const COLORS = ["#0a9470", "#3b82f6", "#8b5cf6", "#f0a63d", "#f4574c", "#ec4899", "#14b8a6", "#eab308"];

export function CategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addCategory } = useAppStore();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CategoryKind>("expense");
  const [color, setColor] = useState(COLORS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    addCategory({ name, kind, color, icon: "MoreHorizontal" });
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cat-name">Name</Label>
          <Input id="cat-name" required placeholder="e.g. Childcare" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cat-kind">Type</Label>
          <Select id="cat-kind" value={kind} onChange={(e) => setKind(e.target.value as CategoryKind)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className="h-8 w-8 rounded-full ring-offset-2 ring-offset-bg-raised"
                style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Category</Button>
        </div>
      </form>
    </Modal>
  );
}
