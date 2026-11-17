"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Panel } from "@/components/ui";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";

type Props = {
  initial?: Service;
};

export function ServiceForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [shortDescription, setShortDescription] = useState(
    initial?.short_description || "",
  );
  const [description, setDescription] = useState(initial?.description || "");
  const [iconKey, setIconKey] = useState(initial?.icon_key || "");
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.append("name", name);
    if (slug) fd.append("slug", slug);
    fd.append("short_description", shortDescription);
    fd.append("description", description);
    fd.append("icon_key", iconKey);
    fd.append("order", order || "0");
    fd.append("is_active", isActive ? "true" : "false");
    fd.append("is_featured", isFeatured ? "true" : "false");
    if (image) fd.append("featured_image", image);

    try {
      if (initial) {
        await api.patchForm(`/admin/services/${initial.id}/`, fd);
        router.replace(`/services/${initial.id}`);
      } else {
        const created = await api.postForm<Service>("/admin/services/", fd);
        router.replace(`/services/${created.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial || !confirm("Delete this service?")) return;
    await api.delete(`/admin/services/${initial.id}/`);
    router.replace("/services");
  }

  return (
    <Panel padded className="mt-2 max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="slug">Slug (optional)</label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="short">Short description</label>
          <input
            id="short"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="icon">Icon key</label>
            <input
              id="icon"
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              placeholder="wood, tile…"
            />
          </div>
          <div className="field">
            <label htmlFor="order">Order</label>
            <input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>
        </div>
        {initial?.featured_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initial.featured_image_url}
            alt=""
            className="max-h-40 border border-brown/10 object-cover"
          />
        ) : null}
        <div className="field">
          <label htmlFor="image">Featured image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        {error ? <p className="alert-error">{error}</p> : null}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <Link href="/services" className="btn-ghost">
            Cancel
          </Link>
          {initial ? (
            <button type="button" className="btn-danger" onClick={remove}>
              Delete
            </button>
          ) : null}
        </div>
      </form>
    </Panel>
  );
}
