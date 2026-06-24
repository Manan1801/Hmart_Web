"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api, setAccessToken, getAccessToken } from "@/src/lib/api/client";

const navItems = [
  { label: "Dashboard", href: "/delivery" },
  { label: "My Orders", href: "/delivery/orders" },
];

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await api.post("/auth/register", { email, password, fullName, phone });
        if (res.data.success) {
          setAccessToken(res.data.data.accessToken);
          onLogin();
        }
      } else {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.success) {
          if (res.data.data.user.role !== "delivery_partner") {
            setError("This account is not a delivery partner. Contact admin to assign the delivery_partner role.");
            return;
          }
          setAccessToken(res.data.data.accessToken);
          onLogin();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-900">HMART Delivery</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === "login" ? "Sign in to manage your deliveries" : "Create a delivery partner account"}
          </p>
        </div>

        <form className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {mode === "register" && (
            <>
              <label className="mb-4 block">
                <span className="text-sm font-medium text-zinc-700">Full Name</span>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600"
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  type="text"
                  value={fullName}
                />
              </label>
              <label className="mb-4 block">
                <span className="text-sm font-medium text-zinc-700">Phone</span>
                <input
                  className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  type="tel"
                  value={phone}
                />
              </label>
            </>
          )}

          <label className="mb-4 block">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <input
              className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="mb-5 block">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <input
              className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600"
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="flex h-11 w-full items-center justify-center rounded-xl bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-500">
            {mode === "login" ? (
              <>
                New delivery partner?{" "}
                <button className="font-medium text-green-700 underline" onClick={() => { setMode("register"); setError(""); }} type="button">
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button className="font-medium text-green-700 underline" onClick={() => { setMode("login"); setError(""); }} type="button">
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Note: After registration, an admin must assign the delivery_partner role to your account.
        </p>
      </div>
    </div>
  );
}

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      if (!getAccessToken()) {
        const refreshRes = await api.post("/auth/refresh");
        if (refreshRes.data.success) {
          setAccessToken(refreshRes.data.data.accessToken);
        } else {
          setAuthed(false);
          return;
        }
      }

      const res = await api.get("/auth/me");
      if (res.data.success && res.data.data.user.role === "delivery_partner") {
        setUserName(res.data.data.user.fullName);
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {}
    setAccessToken(null);
    setAuthed(false);
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onLogin={() => { setAuthed(null); checkAuth(); }} />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link className="text-lg font-bold text-emerald-900" href="/delivery">
            HMART Delivery
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-green-100 text-green-800"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-3 flex items-center gap-2 border-l border-zinc-200 pl-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-zinc-700 sm:inline">{userName}</span>
              <button
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
