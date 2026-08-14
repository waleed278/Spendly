import { cn, clamp } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100+
  className?: string;
  barClassName?: string;
  color?: string;
  trackClassName?: string;
}

export function ProgressBar({ value, className, barClassName, color, trackClassName }: ProgressBarProps) {
  const pct = clamp(value, 0, 100);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-bg-subtle", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", barClassName ?? "bg-brand-500")}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}
