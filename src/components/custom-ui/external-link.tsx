import Link from "next/link"

import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ExternalLinkProps = React.ComponentProps<"a"> & {
  size?: string | number | undefined
}

export const ExternalLink = ({
  className,
  href,
  target,
  rel,
  children,
  size = 16,
  ...restProps
}: ExternalLinkProps) => {
  return (
    <Link
      {...restProps}
      className={cn(
        "inline-flex items-center-safe gap-0.5",
        "text-link-foreground",
        "no-underline hover:underline",
        className,
      )}
      href={href || ""}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLinkIcon size={size || 16} />
    </Link>
  )
}
