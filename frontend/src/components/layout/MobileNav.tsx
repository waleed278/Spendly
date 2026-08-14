import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  X,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/health-score", label: "Health Score", icon: HeartPulse },
  { to: "/app/transactions", label: "Transactions", icon: Receipt },
  { to: "/app/accounts", label: "Accounts", icon: Landmark },
  { to: "/app/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/subscriptions", label: "Subscriptions", icon: RefreshCcw },
  { to: "/app/split", label: "Split & IOU", icon: Users },
  { to: "/app/simulator", label: "What-If Simulator", icon: SlidersHorizontal },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="relative z-10 flex h-full w-64 flex-col bg-bg-raised"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Wallet size={17} />
                </div>
                <span className="text-lg font-bold text-fg">Spendly</span>
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 text-fg-muted hover:bg-bg-subtle">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
