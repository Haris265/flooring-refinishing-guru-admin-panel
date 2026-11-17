"use client";

import { FormEvent, useEffect, useState } from "react";

import { LoadingBlock, PageHeader, Panel } from "@/components/ui";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<SiteSettings>("/admin/settings/")
      .then(setForm)
      .catch((err) => setError(err.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await api.patch<SiteSettings>("/admin/settings/", form);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!form && !error) return <LoadingBlock label="Loading settings…" />;
  if (!form) return <p className="alert-error">{error}</p>;

  return (
    <div>
      <PageHeader
        eyebrow="Site"
        title="Settings"
        description="Company contact details and service area."
      />

      <Panel padded className="max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["company_name", "Company name"],
                ["tagline", "Tagline"],
                ["contact_name", "Contact name"],
                ["phone", "Phone"],
                ["email", "Email"],
                ["website", "Website"],
              ] as const
            ).map(([key, label]) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            ))}
          </div>

          <div className="field">
            <label htmlFor="address_blurb">Address blurb</label>
            <input
              id="address_blurb"
              value={form.address_blurb}
              onChange={(e) =>
                setForm({ ...form, address_blurb: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="service_area">Service area</label>
            <textarea
              id="service_area"
              rows={3}
              value={form.service_area}
              onChange={(e) =>
                setForm({ ...form, service_area: e.target.value })
              }
            />
          </div>
          <div className="field max-w-xs">
            <label htmlFor="years">Years experience</label>
            <input
              id="years"
              type="number"
              min={0}
              value={form.years_experience}
              onChange={(e) =>
                setForm({
                  ...form,
                  years_experience: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          {error ? <p className="alert-error">{error}</p> : null}
          {saved ? <p className="alert-success">Settings saved.</p> : null}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
