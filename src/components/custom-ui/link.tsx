import NextLink from "next/link"

import { ExternalLink } from "./external-link"
import { cn } from "@/lib/utils"

type LinkProps = React.ComponentProps<"a"> & {
  size?: string | number
}

export const Link = ({ href, className, size, ...restProps }: LinkProps) => {
  if (href?.startsWith("http") || href?.startsWith("localhost")) {
    return (
      <ExternalLink
        href={href}
        className={className}
        size={size}
        {...restProps}
      />
    )
  }

  return (
    <NextLink
      href={href || ""}
      className={cn(
        "text-link-foreground no-underline hover:underline",
        className,
      )}
      {...restProps}
    />
  )
}
