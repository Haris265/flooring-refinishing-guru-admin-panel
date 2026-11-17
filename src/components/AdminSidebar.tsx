"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import {
  IconDashboard,
  IconFaqs,
  IconLeads,
  IconProjects,
  IconServices,
  IconSettings,
} from "./NavIcons";

const NAV: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "/", label: "Dashboard", Icon: IconDashboard },
  { href: "/leads", label: "Leads", Icon: IconLeads },
  { href: "/services", label: "Services", Icon: IconServices },
  { href: "/projects", label: "Projects", Icon: IconProjects },
  { href: "/faqs", label: "FAQs", Icon: IconFaqs },
  { href: "/settings", label: "Settings", Icon: IconSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar w-full lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={48}
            height={44}
            className="h-10 w-auto shrink-0"
            priority
          />
          <span className="min-w-0">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
              Admin
            </span>
            <span className="mt-0.5 block font-display text-xl leading-tight text-cream">
              Flooring Guru
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:py-5">
        {NAV.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              data-active={active}
              className="admin-nav-link shrink-0 whitespace-nowrap"
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
