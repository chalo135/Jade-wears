import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = { className?: string; href?: string | null; inverse?: boolean };

/** Text wordmark until the client's logo arrives: "Jade" in Fraunces, "Wears" in the italic accent. */
export function Wordmark({ className, href = "/", inverse = false }: Props) {
  const mark = (
    <span
      className={cn(
        "font-serif text-[1.625rem] leading-none tracking-[-0.01em] whitespace-nowrap",
        inverse ? "text-cream" : "text-mauve",
        className,
      )}
    >
      Jade <span className={cn("font-accent italic", inverse ? "text-blush" : "text-rose-ink")}>Wears</span>
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} className="inline-flex min-h-11 items-center rounded-full" aria-label="Jade Wears, home">
      {mark}
    </Link>
  );
}
