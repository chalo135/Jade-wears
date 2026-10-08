import { cn } from "@/lib/cn";
import { Button } from "./Button";

type Props = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  id?: string;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ title, description, action, id, as: Tag = "h2", className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-2", className)}>
      <div className="max-w-xl">
        <Tag id={id} className={Tag === "h1" ? "text-h1" : "text-h2"}>
          {title}
        </Tag>
        {description && <p className="mt-2 text-mauve-soft">{description}</p>}
      </div>
      {action && (
        <Button href={action.href} variant="link">
          {action.label}
        </Button>
      )}
    </div>
  );
}
