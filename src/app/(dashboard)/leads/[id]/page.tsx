"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LoadingBlock,
  PageHeader,
  Panel,
  StatusChip,
} from "@/components/ui";
import { api } from "@/lib/api";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadStatus>("new");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<Lead>(`/admin/estimates/${id}/`)
      .then((data) => {
        setLead(data);
        setStatus(data.status);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function saveStatus() {
    setSaving(true);
    setError("");
    try {
      const updated = await api.patch<Lead>(`/admin/estimates/${id}/`, {
        status,
      });
      setLead(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this lead?")) return;
    await api.delete(`/admin/estimates/${id}/`);
    router.replace("/leads");
  }

  if (error && !lead) return <p className="alert-error">{error}</p>;
  if (!lead) return <LoadingBlock label="Loading lead…" />;

  const fields: [string, string][] = [
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["ZIP", lead.zip_code],
    ["Rooms / area", lead.rooms_area || "—"],
    ["Current flooring", lead.current_flooring || "—"],
    ["Material preference", lead.material_preference || "—"],
    ["Budget", lead.budget || "—"],
    ["Timing", lead.timing || "—"],
  ];

  return (
    <div className="max-w-3xl">
      <Link
        href="/leads"
        className="text-sm font-semibold text-gold-deep hover:underline"
      >
        ← Back to leads
      </Link>

      <PageHeader
        eyebrow="Lead"
        title={lead.name}
        description={`Received ${new Date(lead.created_at).toLocaleString(
          undefined,
          { dateStyle: "full", timeStyle: "short" },
        )}`}
        actions={<StatusChip status={lead.status} />}
      />

      <div className="detail-grid">
        {fields.map(([label, value]) => (
          <div key={label} className="detail-cell">
            <p className="detail-cell__label">{label}</p>
            <p className="detail-cell__value">{value}</p>
          </div>
        ))}
      </div>

      {lead.message ? (
        <Panel padded className="mt-4">
          <p className="detail-cell__label">Message</p>
          <p className="mt-2 whitespace-pre-wrap text-brown">{lead.message}</p>
        </Panel>
      ) : null}

      {lead.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lead.photo_url}
          alt="Lead photo"
          className="mt-4 max-h-72 border border-brown/10 bg-white object-contain p-2"
        />
      ) : null}

      <Panel padded className="mt-8">
        <div className="flex flex-wrap items-end gap-3">
          <div className="field min-w-[180px]">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={saveStatus}
            disabled={saving}
          >
            {saving ? "Saving…" : "Update status"}
          </button>
          <button type="button" className="btn-danger" onClick={remove}>
            Delete
          </button>
        </div>
        {error ? <p className="alert-error mt-4">{error}</p> : null}
      </Panel>
    </div>
  );
}
