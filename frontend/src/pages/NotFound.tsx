import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
        <Wallet size={26} />
      </div>
      <h1 className="text-3xl font-bold text-fg">404 — Page not found</h1>
      <p className="max-w-sm text-fg-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
