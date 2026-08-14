import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-bg-subtle p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.id
              ? "bg-bg-raised text-fg shadow-sm"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
