import { cn } from "@/lib/cn";

// Static sand placeholders sized to the real layout (same grid, aspect ratios and
// line heights), so the content swaps in without a jump. No spinners, no shimmer.

function Bar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block rounded-full bg-sand", className)} />;
}

function LoadingLabel({ label }: { label: string }) {
  return (
    <span role="status" className="sr-only">
      {label}
    </span>
  );
}

/** Breadcrumb line and title block, matching PageHeading. */
export function PageHeadingSkeleton({ withNote = false }: { withNote?: boolean }) {
  return (
    <div aria-hidden="true">
      <div className="flex h-11 items-center">
        <Bar className="h-3.5 w-44" />
      </div>
      <div className="mt-4 flex h-[1.1em] items-center text-h1">
        <Bar className="h-[0.7em] w-2/3 max-w-md rounded-field" />
      </div>
      {withNote && (
        <div className="mt-3 flex h-[1.6em] max-w-xl items-center">
          <Bar className="h-3 w-4/5" />
        </div>
      )}
    </div>
  );
}

/** A section heading line (text-h2), for result counts. */
export function SectionTitleSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex h-[1.15em] items-center text-h2", className)}>
      <Bar className="h-[0.65em] w-56 max-w-full rounded-field" />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-card bg-white p-1">
      <div className="aspect-[4/5] rounded-image bg-sand" />
      <div className="flex flex-col gap-1 px-2.5 pt-3 pb-3">
        <div className="flex h-[1.4em] items-center text-micro">
          <Bar className="h-2.5 w-2/5" />
        </div>
        <div className="flex h-[1.375em] items-center text-[1.0625rem]">
          <Bar className="h-3.5 w-4/5" />
        </div>
        <div className="flex h-[1.5em] items-center text-small">
          <Bar className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

/** Same grid as ProductGrid: 2 columns on mobile, 4 on desktop. */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={className}>
      <LoadingLabel label="Loading products" />
      <ul aria-hidden="true" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Product page body: 4:5 photo and the price and actions column. */
export function ProductDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <LoadingLabel label="Loading product" />
      <div aria-hidden="true" className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] rounded-image bg-sand" />
        <div>
          <div className="flex h-[1.25em] items-center text-h3">
            <Bar className="h-[0.7em] w-32" />
          </div>
          <div className="mt-4 flex h-[1.6em] items-center">
            <Bar className="h-3 w-1/2" />
          </div>
          <div className="mt-4 space-y-2">
            <Bar className="h-3 w-full max-w-sm" />
            <Bar className="h-3 w-3/4 max-w-xs" />
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Bar className="h-14 w-40" />
            <Bar className="size-11" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** One line of body text. */
export function TextLineSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex h-[1.6em] items-center", className)}>
      <Bar className="h-3 w-48 max-w-full" />
    </div>
  );
}
