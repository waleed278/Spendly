import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Topbar } from "./Topbar";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/transactions": "Transactions",
  "/app/budgets": "Budgets",
  "/app/goals": "Goals",
  "/app/reports": "Reports & Analytics",
  "/app/accounts": "Accounts",
  "/app/subscriptions": "Subscription Radar",
  "/app/split": "Split & IOU",
  "/app/simulator": "What-If Simulator",
  "/app/health-score": "Financial Health Score",
  "/app/settings": "Settings",
};

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { sidebarCollapsed } = useAppStore();
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Spendly";

  return (
    <div className="min-h-screen bg-bg-subtle">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className={cn("transition-all duration-200", sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar onMenuClick={() => setMobileNavOpen(true)} title={title} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
