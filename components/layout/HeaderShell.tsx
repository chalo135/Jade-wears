import type { ReactNode } from "react";

/** Sticky cream header with a sand bottom border. */
export function HeaderShell({ children }: { children: ReactNode }) {
  return <header className="grain sticky top-0 z-40 border-b border-sand bg-cream">{children}</header>;
}
