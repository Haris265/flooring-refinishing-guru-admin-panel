import { PageHeader } from "@/components/ui";
import { ServiceForm } from "@/components/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="New service"
        description="Create a service for the public catalog."
      />
      <ServiceForm />
    </div>
  );
}
