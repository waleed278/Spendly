import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  iconBg?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, iconBg = "bg-brand-500/10 text-brand-600", className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-fg-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-fg">{value}</p>
        </div>
        {icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={cn("mt-3 text-xs font-medium", trend.positive ? "text-income" : "text-expense")}>
          {trend.value}
        </p>
      )}
    </Card>
  );
}
