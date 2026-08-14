import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  PiggyBank,
  Target,
  BarChart3,
  HeartPulse,
  RefreshCcw,
  Users,
  SlidersHorizontal,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const NAV_GROUPS: {
  label: string;
  items: { to: string; label: string; icon: typeof LayoutDashboard; badge?: string }[];
}[] = [
  {
    label: "Overview",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/reports", label: "Reports", icon: BarChart3 },
      { to: "/app/health-score", label: "Health Score", icon: HeartPulse },
    ],
  },
  {
    label: "Money",
    items: [
      { to: "/app/transactions", label: "Transactions", icon: Receipt },
      { to: "/app/accounts", label: "Accounts", icon: Landmark },
      { to: "/app/budgets", label: "Budgets", icon: PiggyBank },
      { to: "/app/goals", label: "Goals", icon: Target },
    ],
  },
  {
    label: "Unique to Spendly",
    items: [
      { to: "/app/subscriptions", label: "Subscriptions", icon: RefreshCcw },
      { to: "/app/split", label: "Split & IOU", icon: Users },
      { to: "/app/simulator", label: "What-If Simulator", icon: SlidersHorizontal },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-bg-raised transition-all duration-200 lg:flex",
        sidebarCollapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Wallet size={17} />
        </div>
        {!sidebarCollapsed && <span className="text-lg font-bold tracking-tight text-fg">Spendly</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            {!sidebarCollapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                    )
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cn(
              "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
            )
          }
        >
          <Settings size={18} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted hover:bg-bg-subtle hover:text-fg"
        >
          {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
