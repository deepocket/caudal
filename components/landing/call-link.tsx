import { hasPhone, site } from "@/lib/site";

/**
 * tel: link to the sales line. Renders nothing until `site.phone` is set, so
 * call buttons can be placed anywhere without showing an empty number.
 * `data-cta` lets an analytics tag count calls without touching this code.
 */
export function CallLink({
  className,
  children,
  label,
}: {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  if (!hasPhone) return null;
  return (
    <a
      href={`tel:${site.phone.e164}`}
      data-cta="llamar"
      aria-label={label ?? `Llamar a Caudal al ${site.phone.display}`}
      className={className}
    >
      {children ?? site.phone.display}
    </a>
  );
}
