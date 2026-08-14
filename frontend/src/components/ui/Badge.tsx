import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "success" | "danger" | "warn" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
  accent: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
  success: "bg-income/10 text-income",
  danger: "bg-expense/10 text-expense",
  warn: "bg-warn/10 text-warn",
  neutral: "bg-fg-subtle/10 text-fg-muted",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
