import { Bell, PiggyBank, CalendarClock, Target, Sparkles, Info } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useAppStore } from "@/store/app-store";
import { formatRelativeDate, cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  budget: PiggyBank,
  bill: CalendarClock,
  goal: Target,
  insight: Sparkles,
  system: Info,
};

export function NotificationsDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Dropdown
      trigger={
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-subtle hover:text-fg">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-expense text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      }
      className="w-80 p-0"
    >
      {() => (
        <div>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-fg">Notifications</p>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-fg-muted">You're all caught up.</p>
            )}
            {notifications.map((n) => {
              const Icon = ICONS[n.type];
              return (
                <DropdownItem
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className="items-start gap-3 rounded-none px-4 py-3"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      n.read ? "bg-bg-subtle text-fg-subtle" : "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    )}
                  >
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", n.read ? "text-fg-muted" : "font-medium text-fg")}>{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-fg-subtle">{n.message}</p>
                    <p className="mt-1 text-[11px] text-fg-subtle">{formatRelativeDate(n.date)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </DropdownItem>
              );
            })}
          </div>
        </div>
      )}
    </Dropdown>
  );
}
