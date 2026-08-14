import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@spendly.app");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Wallet size={18} />
          </div>
          <span className="text-xl font-bold text-fg">Spendly</span>
        </Link>

        <Card className="p-7">
          <h1 className="text-xl font-bold text-fg">Welcome back</h1>
          <p className="mt-1 text-sm text-fg-muted">Log in to see your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                icon={<Mail size={15} />}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="mb-1.5">Password</Label>
                <a href="#" className="mb-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
                  Forgot password?
                </a>
              </div>
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
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Sign up
            </Link>
          </p>
        </Card>
        <p className="mt-4 text-center text-xs text-fg-subtle">
          Demo mode — any credentials will log you into the sample dashboard.
        </p>
      </div>
    </div>
  );
}
