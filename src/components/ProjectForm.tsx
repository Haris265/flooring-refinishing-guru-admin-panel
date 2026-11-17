"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Panel } from "@/components/ui";
import { api } from "@/lib/api";
import { PROJECT_CATEGORIES, type Project } from "@/lib/types";

type Props = {
  initial?: Project;
};

export function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "flooring");
  const [location, setLocation] = useState(initial?.location || "");
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [cover, setCover] = useState<File | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [project, setProject] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.append("title", title);
    if (slug) fd.append("slug", slug);
    fd.append("description", description);
    fd.append("category", category);
    fd.append("location", location);
    fd.append("order", order || "0");
    fd.append("is_featured", isFeatured ? "true" : "false");
    if (cover) fd.append("cover_image", cover);

    try {
      if (initial) {
        const updated = await api.patchForm<Project>(
          `/admin/projects/${initial.id}/`,
          fd,
        );
        setProject(updated);
      } else {
        const created = await api.postForm<Project>("/admin/projects/", fd);
        router.replace(`/projects/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function addGalleryImage() {
    if (!initial || !galleryFile) return;
    const fd = new FormData();
    fd.append("image", galleryFile);
    fd.append("caption", galleryCaption);
    fd.append("order", "0");
    try {
      await api.postForm(`/admin/projects/${initial.id}/images/`, fd);
      const refreshed = await api.get<Project>(`/admin/projects/${initial.id}/`);
      setProject(refreshed);
      setGalleryFile(null);
      setGalleryCaption("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function deleteImage(imageId: number) {
    if (!confirm("Remove this gallery image?")) return;
    await api.delete(`/admin/project-images/${imageId}/`);
    if (initial) {
      const refreshed = await api.get<Project>(`/admin/projects/${initial.id}/`);
      setProject(refreshed);
    }
  }

  async function remove() {
    if (!initial || !confirm("Delete this project?")) return;
    await api.delete(`/admin/projects/${initial.id}/`);
    router.replace("/projects");
  }

  const images = project?.images || initial?.images || [];

  return (
    <div className="mt-2 max-w-2xl space-y-6">
      <Panel padded>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured
            </label>
          </div>
          {(project?.cover_image_url || initial?.cover_image_url) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project?.cover_image_url || initial?.cover_image_url || ""}
              alt=""
              className="max-h-40 border border-brown/10 object-cover"
            />
          )}
          <div className="field">
            <label htmlFor="cover">Cover image</label>
            <input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files?.[0] || null)}
            />
          </div>
          {error ? <p className="alert-error">{error}</p> : null}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <Link href="/projects" className="btn-ghost">
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

      {initial ? (
        <Panel padded>
          <h2 className="font-display text-2xl text-brown">Gallery</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="border border-brown/10 bg-cream/50 p-2">
                {img.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.image_url}
                    alt={img.caption || ""}
                    className="h-28 w-full object-cover"
                  />
                ) : null}
                <p className="mt-1 truncate text-xs text-muted">
                  {img.caption || "—"}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-danger"
                  onClick={() => deleteImage(img.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-brown/10 pt-4">
            <div className="field">
              <label htmlFor="gallery">Add image</label>
              <input
                id="gallery"
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="field">
              <label htmlFor="caption">Caption</label>
              <input
                id="caption"
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={addGalleryImage}
              disabled={!galleryFile}
            >
              Upload to gallery
            </button>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
