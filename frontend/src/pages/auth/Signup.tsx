import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Wallet size={18} />
          </div>
          <span className="text-xl font-bold text-fg">Spendly</span>
        </Link>

        <Card className="p-7">
          <h1 className="text-xl font-bold text-fg">Create your account</h1>
          <p className="mt-1 text-sm text-fg-muted">Free forever for the basics.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                icon={<User size={15} />}
                required
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                icon={<Mail size={15} />}
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                icon={<Lock size={15} />}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Log in
            </Link>
          </p>
        </Card>
        <p className="mt-4 text-center text-xs text-fg-subtle">
          Demo mode — this creates no real account, it opens the sample dashboard.
        </p>
      </div>
    </div>
  );
}
