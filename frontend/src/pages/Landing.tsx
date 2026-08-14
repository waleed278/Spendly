import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowRight,
  HeartPulse,
  SlidersHorizontal,
  Users,
  RefreshCcw,
  BarChart3,
  PiggyBank,
  Target,
  Receipt,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const CORE_FEATURES = [
  { icon: Receipt, title: "Transaction Tracking", desc: "Log income, expenses & transfers with categories, tags and notes." },
  { icon: PiggyBank, title: "Smart Budgets", desc: "Category budgets with real-time progress and overspend alerts." },
  { icon: Target, title: "Savings Goals", desc: "Set targets, track progress, and hit deadlines with confidence." },
  { icon: BarChart3, title: "Deep Reports", desc: "Trends, category breakdowns, and cash flow at a glance." },
];

const UNIQUE_FEATURES = [
  {
    icon: HeartPulse,
    title: "Financial Health Score",
    desc: "One number that captures your savings rate, budget adherence, debt load, and spending consistency — updated live.",
  },
  {
    icon: SlidersHorizontal,
    title: "What-If Simulator",
    desc: "Drag a slider to model 'cut dining 20%' and instantly see the effect on your savings goal timeline.",
  },
  {
    icon: Users,
    title: "Split & IOU Tracker",
    desc: "Splitwise-style shared expenses built right in — no second app needed to settle up with friends.",
  },
  {
    icon: RefreshCcw,
    title: "Subscription Radar",
    desc: "Every recurring charge in one calendar, with cost-creep alerts before renewals hit your account.",
  },
];

const PLANS = [
  { name: "Free", price: "$0", features: ["Unlimited transactions", "3 budgets", "2 accounts", "Basic reports"] },
  { name: "Plus", price: "$6/mo", features: ["Everything in Free", "Unlimited budgets & goals", "Health Score & Simulator", "Subscription Radar"], highlighted: true },
  { name: "Family", price: "$12/mo", features: ["Everything in Plus", "Shared accounts", "Split & IOU tracker", "Priority support"] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Wallet size={17} />
            </div>
            <span className="text-lg font-bold tracking-tight text-fg">Spendly</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-fg-muted md:flex">
            <a href="#features" className="hover:text-fg">Features</a>
            <a href="#unique" className="hover:text-fg">What's Different</a>
            <a href="#pricing" className="hover:text-fg">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-medium text-fg-muted hover:text-fg sm:block">
              Log in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(18,184,134,0.12),transparent)]" />
        <div className="mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-raised px-4 py-1.5 text-xs font-medium text-fg-muted">
            <ShieldCheck size={14} className="text-brand-500" />
            Built for people who want to know where it goes
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
            Track spending. <span className="text-brand-600">Understand it.</span> Act on it.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-fg-muted sm:text-lg">
            Spendly is the expense tracker with everything you expect — budgets, goals,
            reports — plus a Financial Health Score, a What-If Simulator, and shared
            expense splitting no other app bundles together.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg">
                Start tracking free <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/app">
              <Button size="lg" variant="outline">
                View live demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-fg-subtle">No credit card required · Demo uses sample data</p>
        </div>

        {/* Preview card */}
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <Card className="overflow-hidden p-2 shadow-soft">
            <div className="grid grid-cols-1 gap-2 rounded-xl bg-bg-subtle p-4 sm:grid-cols-3">
              {[
                { label: "Net Worth", value: "$22,928", tone: "text-fg" },
                { label: "Health Score", value: "78 / 100", tone: "text-brand-600" },
                { label: "This Month Saved", value: "$1,240", tone: "text-income" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-bg-raised p-5">
                  <p className="text-xs font-medium text-fg-muted">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Core features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-fg">Everything a tracker should have</h2>
          <p className="mt-2 text-fg-muted">The fundamentals, done cleanly.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <f.icon size={19} />
              </div>
              <h3 className="font-semibold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-fg-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Unique features */}
      <section id="unique" className="bg-bg-subtle py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-fg">What makes Spendly different</h2>
            <p className="mt-2 text-fg-muted">Four things you won't find bundled anywhere else.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {UNIQUE_FEATURES.map((f) => (
              <Card key={f.title} className="flex gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-fg">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-muted">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-fg">Simple pricing</h2>
          <p className="mt-2 text-fg-muted">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 ${plan.highlighted ? "border-2 border-brand-500 shadow-soft" : ""}`}
            >
              <h3 className="font-semibold text-fg">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-fg">{plan.price}</p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-fg-muted">
                    <Check size={15} className="text-brand-500" /> {feat}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-6 block">
                <Button variant={plan.highlighted ? "primary" : "outline"} className="w-full">
                  Choose {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <Card className="bg-brand-600 p-10 text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Know where it goes.</h2>
          <p className="mx-auto mt-2 max-w-md text-brand-50/90">
            Join Spendly and turn your spending data into decisions today.
          </p>
          <Link to="/signup" className="mt-6 inline-block">
            <Button variant="outline" className="border-white/30 bg-white text-brand-700 hover:bg-brand-50">
              Create your free account
            </Button>
          </Link>
        </Card>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-fg-subtle sm:flex-row">
          <span>© 2026 Spendly. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-fg">Privacy</a>
            <a href="#" className="hover:text-fg">Terms</a>
            <a href="#" className="hover:text-fg">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
