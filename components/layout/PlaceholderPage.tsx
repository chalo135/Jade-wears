import type { ReactNode } from "react";
import type { Crumb } from "./Breadcrumbs";
import { PageFrame, PageHeading } from "./PageFrame";

type Props = {
  title: string;
  trail?: Crumb[];
  note?: string;
  children?: ReactNode;
};

/** Stand-in for static pages that are built in later stages, so demo links never 404. */
export function PlaceholderPage({ title, trail = [], note, children }: Props) {
  return (
    <PageFrame>
      <PageHeading title={title} trail={trail} note={note} />
      {children && <div className="mt-10">{children}</div>}
    </PageFrame>
  );
}
