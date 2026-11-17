import type { LeadStatus } from "@/lib/types";

type StatusChipProps = {
  status: LeadStatus | string;
};

export function StatusChip({ status }: StatusChipProps) {
  return <span className={`status-chip status-${status}`}>{status}</span>;
}
