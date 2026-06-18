import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_USERNAME = "burak35";
const ADMIN_PASSWORD = "burak123";
const STORAGE_KEY = "admin_gate_unlocked";

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(null);
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-border rounded-lg p-6 space-y-4 bg-card"
      >
        <div>
          <h1 className="text-xl font-bold">Yönetici Girişi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Devam etmek için kullanıcı adı ve şifre girin.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-username">Kullanıcı adı</Label>
          <Input
            id="admin-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Şifre</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">Giriş</Button>
      </form>
    </div>
  );
}
