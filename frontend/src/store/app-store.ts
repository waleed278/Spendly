import { create } from "zustand";
import {
  ACCOUNTS,
  BUDGETS,
  CATEGORIES,
  GOALS,
  NOTIFICATIONS,
  SPLIT_EXPENSES,
  SUBSCRIPTIONS,
  TRANSACTIONS,
} from "@/lib/mock-data";
import type {
  Account,
  AppNotification,
  Budget,
  Category,
  Goal,
  SplitExpense,
  Subscription,
  Transaction,
} from "@/lib/types";

interface AppState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
  splitExpenses: SplitExpense[];
  notifications: AppNotification[];
  sidebarCollapsed: boolean;

  toggleSidebar: () => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (b: Omit<Budget, "id">) => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  contributeToGoal: (id: string, amount: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSubscriptionStatus: (id: string) => void;
  settleSplitParticipant: (splitId: string, participantId: string) => void;
  addAccount: (a: Omit<Account, "id">) => void;
  addSubscription: (s: Omit<Subscription, "id">) => void;
  addSplitExpense: (s: Omit<SplitExpense, "id">) => void;
  addCategory: (c: Omit<Category, "id">) => void;
}

let txnCounter = TRANSACTIONS.length + 1;
let budgetCounter = BUDGETS.length + 1;
let goalCounter = GOALS.length + 1;
let accountCounter = ACCOUNTS.length + 1;
let subCounter = SUBSCRIPTIONS.length + 1;
let splitCounter = SPLIT_EXPENSES.length + 1;
let categoryCounter = CATEGORIES.length + 1;

export const useAppStore = create<AppState>()((set) => ({
  accounts: ACCOUNTS,
  categories: CATEGORIES,
  transactions: TRANSACTIONS,
  budgets: BUDGETS,
  goals: GOALS,
  subscriptions: SUBSCRIPTIONS,
  splitExpenses: SPLIT_EXPENSES,
  notifications: NOTIFICATIONS,
  sidebarCollapsed: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addTransaction: (t) =>
    set((s) => ({
      transactions: [{ ...t, id: `txn-new-${txnCounter++}` }, ...s.transactions],
    })),

  deleteTransaction: (id) =>
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

  addBudget: (b) =>
    set((s) => ({ budgets: [...s.budgets, { ...b, id: `bud-new-${budgetCounter++}` }] })),

  updateBudgetLimit: (id, limit) =>
    set((s) => ({
      budgets: s.budgets.map((b) => (b.id === id ? { ...b, limit } : b)),
    })),

  addGoal: (g) =>
    set((s) => ({ goals: [...s.goals, { ...g, id: `goal-new-${goalCounter++}` }] })),

  contributeToGoal: (id, amount) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
      ),
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  toggleSubscriptionStatus: (id) =>
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: sub.status === "active" ? "cancelled" : "active" } : sub
      ),
    })),

  settleSplitParticipant: (splitId, participantId) =>
    set((s) => ({
      splitExpenses: s.splitExpenses.map((split) =>
        split.id === splitId
          ? {
              ...split,
              participants: split.participants.map((p) =>
                p.id === participantId ? { ...p, settled: !p.settled } : p
              ),
            }
          : split
      ),
    })),

  addAccount: (a) =>
    set((s) => ({ accounts: [...s.accounts, { ...a, id: `acc-new-${accountCounter++}` }] })),

  addSubscription: (sub) =>
    set((s) => ({ subscriptions: [...s.subscriptions, { ...sub, id: `sub-new-${subCounter++}` }] })),

  addSplitExpense: (split) =>
    set((s) => ({ splitExpenses: [{ ...split, id: `split-new-${splitCounter++}` }, ...s.splitExpenses] })),

  addCategory: (c) =>
    set((s) => ({ categories: [...s.categories, { ...c, id: `cat-new-${categoryCounter++}` }] })),
}));
