"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pagination,
  Panel,
} from "@/components/ui";
import { api } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginate } from "@/lib/paginate";
import type { FAQ } from "@/lib/types";

const empty = {
  question: "",
  answer: "",
  category: "General",
  order: "0",
  is_active: true,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[] | null>(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pageItems = useMemo(
    () => paginate(faqs || [], page, DEFAULT_PAGE_SIZE),
    [faqs, page],
  );

  function load() {
    api
      .get<FAQ[]>("/admin/faqs/")
      .then(setFaqs)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(faq: FAQ) {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: String(faq.order),
      is_active: faq.is_active,
    });
  }

  function reset() {
    setEditing(null);
    setForm(empty);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      question: form.question,
      answer: form.answer,
      category: form.category,
      order: Number(form.order) || 0,
      is_active: form.is_active,
    };
    try {
      if (editing) {
        await api.patch(`/admin/faqs/${editing.id}/`, payload);
      } else {
        await api.post("/admin/faqs/", payload);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this FAQ?")) return;
    await api.delete(`/admin/faqs/${id}/`);
    if (editing?.id === id) reset();
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="FAQs"
        description="Questions shown on the public FAQ page."
      />

      <Panel padded className="mb-8 max-w-2xl">
        <h2 className="font-display text-xl text-brown">
          {editing ? "Edit FAQ" : "Add FAQ"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="field">
            <label htmlFor="q">Question</label>
            <input
              id="q"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="a">Answer</label>
            <textarea
              id="a"
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="cat">Category</label>
              <input
                id="cat"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="ord">Order</label>
              <input
                id="ord"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            Active
          </label>
          {error ? <p className="alert-error">{error}</p> : null}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing ? "Update" : "Add"}
            </button>
            {editing ? (
              <button type="button" className="btn-ghost" onClick={reset}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      {!faqs ? (
        <LoadingBlock label="Loading FAQs…" />
      ) : (
        <Panel>
          {faqs.length === 0 ? (
            <EmptyState
              title="No FAQs yet"
              description="Add questions above to populate the public FAQ page."
            />
          ) : (
            <>
              <div className="table-wrap !border-0">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Category</th>
                      <th>Active</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((faq) => (
                      <tr key={faq.id}>
                        <td className="max-w-md">{faq.question}</td>
                        <td>{faq.category}</td>
                        <td>{faq.is_active ? "Yes" : "No"}</td>
                        <td className="space-x-3 whitespace-nowrap">
                          <button
                            type="button"
                            className="text-sm font-semibold text-gold-deep"
                            onClick={() => startEdit(faq)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold text-danger"
                            onClick={() => remove(faq.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                total={faqs.length}
                onPageChange={setPage}
              />
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
