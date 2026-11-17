"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ProjectForm } from "@/components/ProjectForm";
import { LoadingBlock, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Project>(`/admin/projects/${id}/`)
      .then(setProject)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="alert-error">{error}</p>;
  if (!project) return <LoadingBlock label="Loading project…" />;

  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="Edit project"
        description={project.title}
      />
      <ProjectForm initial={project} />
    </div>
  );
}
