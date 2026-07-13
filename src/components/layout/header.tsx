"use client"

import Link from "next/link"
import { House, Newspaper, Book, Settings, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGlobalContext } from "./context"

type HeaderProps = {
  className?: string
  showLeftDrawerOpener: boolean
  openLeftDrawer: () => void
}

export const Header = ({
  className,
  showLeftDrawerOpener,
  openLeftDrawer,
}: HeaderProps) => {
  const { preferredTheme, setPreferredTheme, theme } = useGlobalContext()

  const toggleTheme = () => {
    setPreferredTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        className,
        "bg-secondary/50 border-b border-dashed px-4",
        "sticky top-0 backdrop-blur-xs",
        "flex items-center justify-between gap-4",
      )}
    >
      {showLeftDrawerOpener && (
        <Button size="icon-lg" variant="outline" onClick={openLeftDrawer}>
          <PanelLeftOpen />
        </Button>
      )}

      <div className="mr-auto">
        <Link className="text-lg font-bold hover:no-underline" href="/">
          lorem314.io
        </Link>
      </div>

      {preferredTheme !== "system" ? (
        <Button variant="outline" size="icon-lg" onClick={toggleTheme}>
          <ThemeToggler />
        </Button>
      ) : null}

      <div id="right-drawer-anchor"></div>
    </header>
  )
}

const ThemeToggler = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 3l0 18"></path>
      <path d="M12 9l4.65 -4.65"></path>
      <path d="M12 14.3l7.37 -7.37"></path>
      <path d="M12 19.6l8.85 -8.85"></path>
    </svg>
  )
}
