import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Href = ComponentProps<typeof Link>["href"];

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: Href;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`btn-night ${className}`}>
      {children}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  className = "",
}: {
  href: Href;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`link-quiet ${className}`}>
      {children}
    </Link>
  );
}
