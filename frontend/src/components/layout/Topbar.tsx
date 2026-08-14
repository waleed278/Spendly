import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Sun, Moon, Plus, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { NotificationsDropdown } from "@/components/shared/NotificationsDropdown";
import { AddTransactionModal } from "@/components/shared/AddTransactionModal";
import { useThemeStore } from "@/store/theme-store";

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-subtle lg:hidden"
      >
        <Menu size={19} />
      </button>

      <h1 className="hidden text-lg font-semibold text-fg sm:block">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden w-56 md:block lg:w-72">
          <Input icon={<Search size={15} />} placeholder="Search transactions..." />
        </div>

        <Button size="sm" onClick={() => setAddOpen(true)} className="hidden sm:inline-flex">
          <Plus size={15} />
          Add
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setAddOpen(true)} className="sm:hidden">
          <Plus size={17} />
        </Button>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-subtle hover:text-fg"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <NotificationsDropdown />

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-bg-subtle">
              <Avatar name="Alex Rivera" size={32} />
            </button>
          }
          className="w-56"
        >
          {(close) => (
            <div>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-fg">Alex Rivera</p>
                <p className="text-xs text-fg-subtle">alex@spendly.app</p>
              </div>
              <div className="my-1 h-px bg-border" />
              <DropdownItem
                onClick={() => {
                  navigate("/app/settings");
                  close();
                }}
              >
                <User size={15} /> Profile
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate("/app/settings");
                  close();
                }}
              >
                <Settings size={15} /> Settings
              </DropdownItem>
              <div className="my-1 h-px bg-border" />
              <DropdownItem
                onClick={() => {
                  navigate("/");
                  close();
                }}
                className="text-expense"
              >
                <LogOut size={15} /> Log out
              </DropdownItem>
            </div>
          )}
        </Dropdown>
      </div>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </header>
  );
}
