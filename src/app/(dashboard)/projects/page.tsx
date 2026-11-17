"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pagination,
  Panel,
} from "@/components/ui";
import { api } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginate } from "@/lib/paginate";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Project[]>("/admin/projects/")
      .then(setProjects)
      .catch((err) => setError(err.message));
  }, []);

  const pageItems = useMemo(
    () => paginate(projects || [], page, DEFAULT_PAGE_SIZE),
    [projects, page],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="Projects"
        description="Portfolio pieces for the public projects page."
        actions={
          <Link href="/projects/new" className="btn-primary">
            Add project
          </Link>
        }
      />

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      {!projects ? (
        <LoadingBlock label="Loading projects…" />
      ) : (
        <Panel>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Add a project with a cover image to get started."
            />
          ) : (
            <>
              <div className="table-wrap !border-0">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link href={`/projects/${p.id}`}>{p.title}</Link>
                        </td>
                        <td className="capitalize">{p.category}</td>
                        <td>{p.location || "—"}</td>
                        <td>{p.is_featured ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                total={projects.length}
                onPageChange={setPage}
              />
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
