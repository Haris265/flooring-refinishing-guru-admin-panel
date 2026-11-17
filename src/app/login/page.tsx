"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAccessToken()) router.replace("/");
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-panel">
        <Image
          src="/images/logo-mark.png"
          alt="Flooring & Refinishing Guru"
          width={56}
          height={52}
          className="h-12 w-auto"
          priority
        />
        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          Flooring &amp; Refinishing Guru
        </p>
        <h1 className="mt-3 font-display text-4xl text-brown">Admin sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Staff access for leads, services, projects, and site content.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error ? (
            <p className="alert-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
