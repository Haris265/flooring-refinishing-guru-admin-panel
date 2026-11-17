"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pagination,
  Panel,
  StatusChip,
} from "@/components/ui";
import { api } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginate } from "@/lib/paginate";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";

function LeadsContent() {
  const searchParams = useSearchParams();
  const initial =
    (searchParams.get("status") as LeadStatus | null) || ("" as const);
  const [status, setStatus] = useState<LeadStatus | "">(initial);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const q = status ? `?status=${status}` : "";
    api
      .get<Lead[]>(`/admin/estimates/${q}`)
      .then(setLeads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  const pageItems = useMemo(
    () => paginate(leads, page, DEFAULT_PAGE_SIZE),
    [leads, page],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Leads"
        description="Estimate requests from the website form."
      />

      <div className="segmented mb-6">
        <button
          type="button"
          data-active={!status}
          onClick={() => setStatus("")}
        >
          All
        </button>
        {LEAD_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            data-active={status === s}
            onClick={() => setStatus(s)}
            className="capitalize"
          >
            {s}
          </button>
        ))}
      </div>

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      {loading ? (
        <LoadingBlock label="Loading leads…" />
      ) : (
        <Panel>
          {leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              description="Try another status filter or check back later."
            />
          ) : (
            <>
              <div className="table-wrap !border-0">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>ZIP</th>
                      <th>Status</th>
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <Link href={`/leads/${lead.id}`}>{lead.name}</Link>
                        </td>
                        <td>{lead.phone}</td>
                        <td>{lead.zip_code}</td>
                        <td>
                          <StatusChip status={lead.status} />
                        </td>
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
              <Pagination
                page={page}
                total={leads.length}
                onPageChange={setPage}
              />
            </>
          )}
        </Panel>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="Loading leads…" />}>
      <LeadsContent />
    </Suspense>
  );
}
