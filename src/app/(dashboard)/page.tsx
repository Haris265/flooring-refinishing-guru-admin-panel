"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { Stats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Stats>("/admin/stats/")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="alert-error">{error}</p>;
  }

  if (!stats) {
    return <LoadingBlock label="Loading dashboard…" />;
  }

  const cards = [
    { label: "New leads", value: stats.new_leads, href: "/leads?status=new" },
    { label: "Total leads", value: stats.total_leads, href: "/leads" },
    { label: "Services", value: stats.services, href: "/services" },
    { label: "Projects", value: stats.projects, href: "/projects" },
    { label: "FAQs", value: stats.faqs, href: "/faqs" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Quick snapshot of leads and content across the site."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-brown">Recent new leads</h2>
          <Link
            href="/leads"
            className="text-sm font-semibold text-gold-deep hover:underline"
          >
            View all →
          </Link>
        </div>
        <Panel>
          {stats.recent_leads.length === 0 ? (
            <EmptyState
              title="No new leads yet"
              description="New estimate requests will show up here."
            />
          ) : (
            <div className="table-wrap !border-0 !shadow-none">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>ZIP</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <Link href={`/leads/${lead.id}`}>{lead.name}</Link>
                      </td>
                      <td>{lead.phone}</td>
                      <td>{lead.zip_code}</td>
                      <td>
                        {new Date(lead.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
