import { useState } from "react";
import { Plus, Sun, Moon, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CategoryModal } from "@/components/shared/CategoryModal";
import { useAppStore } from "@/store/app-store";
import { useThemeStore } from "@/store/theme-store";

export default function Settings() {
  const { categories } = useAppStore();
  const { theme, setTheme } = useThemeStore();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@spendly.app");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MMM D, YYYY");
  const [saved, setSaved] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    budgetAlerts: true,
    billReminders: true,
    goalUpdates: true,
    weeklySummary: false,
    productNews: false,
  });

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-fg">Settings</h2>
        <p className="text-sm text-fg-muted">Manage your profile, preferences, and categories.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={name || "A"} size={56} />
                <div>
                  <p className="text-sm font-medium text-fg">Profile photo</p>
                  <p className="text-xs text-fg-subtle">Generated automatically from your name.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="settings-name">Full name</Label>
                  <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">
                  <Save size={15} /> Save changes
                </Button>
                {saved && <span className="text-sm font-medium text-income">Saved!</span>}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium ${
                    theme === "light" ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-border text-fg-muted"
                  }`}
                >
                  <Sun size={15} /> Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium ${
                    theme === "dark" ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-border text-fg-muted"
                  }`}
                >
                  <Moon size={15} /> Dark
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="settings-currency">Currency</Label>
              <Select id="settings-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="settings-date">Date format</Label>
              <Select id="settings-date" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                <option value="MMM D, YYYY">Aug 14, 2026</option>
                <option value="DD/MM/YYYY">14/08/2026</option>
                <option value="MM/DD/YYYY">08/14/2026</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "budgetAlerts" as const, label: "Budget alerts", desc: "When a category is close to or over budget." },
              { key: "billReminders" as const, label: "Bill reminders", desc: "Before a subscription or bill is charged." },
              { key: "goalUpdates" as const, label: "Goal updates", desc: "Milestones and completed goals." },
              { key: "weeklySummary" as const, label: "Weekly summary", desc: "A recap of income, spending, and savings." },
              { key: "productNews" as const, label: "Product news", desc: "New features and occasional tips." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-fg">{item.label}</p>
                  <p className="text-xs text-fg-subtle">{item.desc}</p>
                </div>
                <Switch
                  checked={notifPrefs[item.key]}
                  onChange={(v) => setNotifPrefs((p) => ({ ...p, [item.key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-subtle hover:text-fg"
            >
              <Plus size={15} />
            </button>
          </CardHeader>
          <CardContent className="max-h-80 space-y-1 overflow-y-auto scrollbar-thin">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-bg-subtle">
                <div className="flex items-center gap-2.5">
                  <CategoryIcon icon={c.icon} color={c.color} size={14} />
                  <span className="text-sm text-fg">{c.name}</span>
                </div>
                <Badge tone={c.kind === "income" ? "success" : "neutral"}>{c.kind}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CategoryModal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
    </div>
  );
}
