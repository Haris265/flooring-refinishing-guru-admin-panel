"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AdminSidebar } from "@/components/AdminSidebar";
import { getAccessToken, logout } from "@/lib/auth";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/services": "Services",
  "/projects": "Projects",
  "/faqs": "FAQs",
  "/settings": "Settings",
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/leads/")) return "Lead detail";
  if (pathname.startsWith("/services/")) return "Service";
  if (pathname.startsWith("/projects/")) return "Project";
  return "Admin";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        <div className="w-full max-w-sm space-y-3 px-6">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-40 w-full" />
          <p className="text-sm">Preparing console…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Flooring &amp; Refinishing Guru
            </p>
            <p className="font-display text-xl text-brown">
              {resolveTitle(pathname)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost text-sm"
            >
              View site
            </a>
            <button
              type="button"
              className="btn-ghost text-sm"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              Log out
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
