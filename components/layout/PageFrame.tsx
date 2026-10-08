import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** URL-independent page container. Stays in the shared App Shell so it paints instantly on navigation. */
export function PageFrame({ children, footnote }: { children: ReactNode; footnote?: string }) {
  return (
    <div className="page-x py-6 sm:py-10">
      {children}
      {footnote && <p className="mt-14 border-t border-sand pt-5 text-small text-mauve-soft">{footnote}</p>}
    </div>
  );
}

/** Breadcrumb (starting at Home) plus the page title. */
export function PageHeading({ title, trail = [], note }: { title: string; trail?: Crumb[]; note?: string }) {
  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, ...trail]} />
      <h1 className="mt-4 text-h1">{title}</h1>
      {note && <p className="mt-3 max-w-xl text-mauve-soft">{note}</p>}
    </>
  );
}
