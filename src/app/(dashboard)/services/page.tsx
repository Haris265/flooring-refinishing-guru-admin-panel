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
import type { Service } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Service[]>("/admin/services/")
      .then(setServices)
      .catch((err) => setError(err.message));
  }, []);

  const pageItems = useMemo(
    () => paginate(services || [], page, DEFAULT_PAGE_SIZE),
    [services, page],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Services"
        description="Public service listings shown on the website."
        actions={
          <Link href="/services/new" className="btn-primary">
            Add service
          </Link>
        }
      />

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      {!services ? (
        <LoadingBlock label="Loading services…" />
      ) : (
        <Panel>
          {services.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Add your first service to populate the catalog."
            />
          ) : (
            <>
              <div className="table-wrap !border-0">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Order</th>
                      <th>Active</th>
                      <th>Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <Link href={`/services/${s.id}`}>{s.name}</Link>
                        </td>
                        <td>{s.order}</td>
                        <td>{s.is_active ? "Yes" : "No"}</td>
                        <td>{s.is_featured ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                total={services.length}
                onPageChange={setPage}
              />
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
