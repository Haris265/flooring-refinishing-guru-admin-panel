"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ServiceForm } from "@/components/ServiceForm";
import { LoadingBlock, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Service>(`/admin/services/${id}/`)
      .then(setService)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="alert-error">{error}</p>;
  if (!service) return <LoadingBlock label="Loading service…" />;

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Edit service"
        description={service.name}
      />
      <ServiceForm initial={service} />
    </div>
  );
}
