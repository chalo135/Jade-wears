import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "soft" | "outline" | "inverse" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-deep-rose text-white hover:bg-rose-ink hover:shadow-pop",
  soft: "bg-blush text-mauve hover:bg-blush-deep",
  outline: "border border-mauve text-mauve hover:bg-mauve hover:text-cream",
  inverse: "bg-cream text-mauve hover:bg-blush [--focus-ring:var(--color-cream)]",
  link: "text-rose-ink underline decoration-rose decoration-1 underline-offset-[5px] hover:decoration-rose-ink hover:decoration-2",
};

// sm is 40px tall; its ::before grows the hit area to 44px.
const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-small before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-['']",
  md: "h-12 px-6 text-body",
  lg: "h-14 px-8 text-body",
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined; loading?: boolean } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,color,box-shadow,scale,text-decoration-color] duration-200 ease-soft active:scale-97",
    "disabled:pointer-events-none disabled:bg-sand disabled:text-mauve-soft disabled:shadow-none",
    variant === "link" ? "min-h-11 px-0" : sizes[size],
    variants[variant],
    className,
  );
}

export function Button(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props;
    return (
      <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, loading = false, type = "button", disabled, ...rest } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      // Busy buttons keep their full colour, so block clicks without the disabled styles.
      className={buttonClasses(variant, size, cn(loading && "pointer-events-none", className))}
      {...rest}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner />
          <span className="sr-only">Loading</span>
        </span>
      )}
    </button>
  );
}
