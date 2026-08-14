import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "@/store/theme-store";
import { AppLayout } from "@/components/layout/AppLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Budgets from "@/pages/Budgets";
import Goals from "@/pages/Goals";
import Reports from "@/pages/Reports";
import Accounts from "@/pages/Accounts";
import Subscriptions from "@/pages/Subscriptions";
import SplitExpenses from "@/pages/SplitExpenses";
import Simulator from "@/pages/Simulator";
import HealthScore from "@/pages/HealthScore";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="split" element={<SplitExpenses />} />
        <Route path="simulator" element={<Simulator />} />
        <Route path="health-score" element={<HealthScore />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
