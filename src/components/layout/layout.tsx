"use client"
import * as React from "react"

import { Header } from "./header"
import { Footer } from "./footer"
import { Sidebar } from "./sidebar"
import { Drawer, useDrawer } from "../custom-ui/drawer"
import { GlobalContext } from "./context"
import { useIsMounted } from "@/hooks/use-mounted"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import type { PreferredTheme, Theme } from "@/types"

const preferredThemeValidator = (raw: string) => {
  return [`"light"`, `"dark"`, `"system"`].includes(raw) ? true : false
}

const isLeftDrawerAlwaysCollapsedValidator = (raw: string) => {
  return ["true", "false"].includes(raw) ? true : false
}

const preferredNpmValidator = (raw: string) => {
  return [`"npm"`, `"yarn"`, `"pnpm"`, `"bun"`].includes(raw) ? true : false
}

export function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMounted = useIsMounted()

  const [theme, setTheme] = React.useState<Theme>("light")
  const [preferredTheme, setPreferredTheme] = useLocalStorage<PreferredTheme>(
    "preferred-theme",
    "system",
    preferredThemeValidator,
  )

  const [isLeftDrawerAlwaysCollapsed, setIsLeftDrawerAlwaysCollapsed] =
    useLocalStorage(
      "is-left-drawer-always-collapsed",
      false,
      isLeftDrawerAlwaysCollapsedValidator,
    )

  const [preferredNpm, setPreferredNpm] = useLocalStorage(
    "preferred-npm",
    "npm",
    preferredNpmValidator,
  )

  const {
    isCollapsed: isLeftDrawerCollapsed,
    isOpen: isLeftDrawerOpen,
    handler: leftDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isLeftDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 1800px)",
  })

  // theme
  React.useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleThemeChange = ({ matches }: { matches: boolean }) => {
      if (matches) {
        document.documentElement.classList.replace("light", "dark")
        document.documentElement.style.colorScheme = "dark"
        setTheme("dark")
      } else {
        document.documentElement.classList.replace("dark", "light")
        document.documentElement.style.colorScheme = "light"
        setTheme("light")
      }
    }

    if (preferredTheme === "system") {
      darkQuery.addEventListener("change", handleThemeChange)
      const theme = darkQuery.matches ? "dark" : "light"
      document.documentElement.classList.remove("light")
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add(theme)
      document.documentElement.style.colorScheme = theme
      setTheme(theme)
    } else {
      darkQuery.removeEventListener("change", handleThemeChange)
      document.documentElement.classList.remove("light")
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add(preferredTheme)
      document.documentElement.style.colorScheme = preferredTheme
      setTheme(preferredTheme)
    }

    return () => {
      darkQuery.removeEventListener("change", handleThemeChange)
    }
  }, [preferredTheme])

  const showLeftDrawerOpener =
    isLeftDrawerAlwaysCollapsed || isLeftDrawerCollapsed
  const drawerWidth = "360px"

  return isMounted ? (
    <div className="flex min-h-svh flex-col">
      <GlobalContext.Provider
        value={{
          theme,
          preferredTheme,
          setPreferredTheme,
          preferredNpm,
          setPreferredNpm,
          isLeftDrawerAlwaysCollapsed,
          setIsLeftDrawerAlwaysCollapsed,
        }}
      >
        <Header
          className="z-40 h-(--header-height)"
          showLeftDrawerOpener={showLeftDrawerOpener}
          openLeftDrawer={leftDrawerHandler.open}
        />

        <div className="flex min-h-[calc(100vh-var(--header-height))]">
          {showLeftDrawerOpener ? (
            <Drawer
              isOpen={isLeftDrawerOpen}
              onClose={leftDrawerHandler.close}
              side="left"
              size={drawerWidth}
            >
              {({ closeDrawer }) => <Sidebar closeDrawer={closeDrawer} />}
            </Drawer>
          ) : (
            <aside
              className={cn(
                "sticky top-(--header-height) border-r border-dashed",
                "h-[calc(100vh-var(--header-height))]",
                "bg-background shrink-0 overflow-auto",
              )}
              style={{ width: drawerWidth }}
            >
              <Sidebar />
            </aside>
          )}

          <main className="relative flex min-w-0 grow flex-col">
            <div className="my-8 grow px-4">{children}</div>
            <Footer />
          </main>
        </div>
      </GlobalContext.Provider>
    </div>
  ) : null
}
