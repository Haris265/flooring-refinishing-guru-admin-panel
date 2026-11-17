import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function Panel({ children, className = "", padded = false }: PanelProps) {
  return (
    <div className={`panel ${padded ? "p-5 md:p-6" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
