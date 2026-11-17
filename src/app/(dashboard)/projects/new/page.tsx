import { PageHeader } from "@/components/ui";
import { ProjectForm } from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="New project"
        description="Add a portfolio project with cover and gallery images."
      />
      <ProjectForm />
    </div>
  );
}
