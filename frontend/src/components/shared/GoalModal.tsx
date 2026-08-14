import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/store/app-store";

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
}

const GOAL_ICONS = [
  { icon: "ShieldCheck", color: "#12b886", label: "Safety net" },
  { icon: "Plane", color: "#3b82f6", label: "Travel" },
  { icon: "Laptop", color: "#8b5cf6", label: "Tech" },
  { icon: "Home", color: "#f0a63d", label: "Home" },
  { icon: "Gift", color: "#ec4899", label: "Gift" },
];

export function GoalModal({ open, onClose }: GoalModalProps) {
  const { addGoal } = useAppStore();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [iconIdx, setIconIdx] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetNum = parseFloat(target);
    if (!name || !targetNum || !deadline) return;
    const chosen = GOAL_ICONS[iconIdx];
    addGoal({
      name,
      icon: chosen.icon,
      color: chosen.color,
      targetAmount: targetNum,
      currentAmount: parseFloat(current) || 0,
      deadline: new Date(deadline).toISOString(),
    });
    setName("");
    setTarget("");
    setCurrent("");
    setDeadline("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Savings Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="goal-name">Goal name</Label>
          <Input id="goal-name" required placeholder="e.g. New Car" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="goal-target">Target amount</Label>
            <Input id="goal-target" type="number" min="1" required value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="goal-current">Already saved</Label>
            <Input id="goal-current" type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="goal-deadline">Target date</Label>
          <Input id="goal-deadline" type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="goal-icon">Icon</Label>
          <Select id="goal-icon" value={iconIdx} onChange={(e) => setIconIdx(Number(e.target.value))}>
            {GOAL_ICONS.map((g, i) => (
              <option key={g.icon} value={i}>
                {g.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Goal</Button>
        </div>
      </form>
    </Modal>
  );
}
