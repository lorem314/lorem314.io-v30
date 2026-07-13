"use client"

import * as React from "react"
import { ListTreeIcon } from "lucide-react"
import type { TableOfContents } from "fumadocs-core/toc"

import { Button } from "@/components/ui/button"
import { Drawer, useDrawer } from "@/components/custom-ui/drawer"
import { ClientPortal } from "@/components/custom-ui/client-portal"
import { cn } from "@/lib/utils"

import { Actions } from "./actions"
import { Toc } from "./toc"

type LayoutProps = {
  title: string
  toc: TableOfContents
  children: React.ReactNode
}

export function Layout({ title, toc, children }: LayoutProps) {
  const isRightDrawerAlwaysCollapsed = false

  const {
    isCollapsed: isRightDrawerCollapsed,
    isOpen: isRightDrawerOpen,
    handler: rightDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isRightDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 1279px)",
  })

  const showRightDrawerOpener =
    isRightDrawerAlwaysCollapsed || isRightDrawerCollapsed

  return (
    <div
      className={cn(
        "relative mx-auto flex flex-col-reverse gap-6",
        "md:grid md:max-w-3xl md:grid-cols-[40px_minmax(60ch,1fr)]",
        "xl:max-w-7xl xl:grid-cols-[40px_minmax(60ch,1fr)_420px]",
      )}
    >
      <Actions />

      <div
        className={cn(
          "shrink-0 grow py-4",
          showRightDrawerOpener ? "grow-0" : "",
        )}
      >
        {children}
      </div>

      {showRightDrawerOpener ? (
        <>
          <ClientPortal targetId="right-drawer-anchor">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={rightDrawerHandler.open}
            >
              <ListTreeIcon />
            </Button>
          </ClientPortal>
          <Drawer
            isOpen={isRightDrawerOpen}
            onClose={rightDrawerHandler.close}
            title="目录"
            side="right"
            size="420px"
          >
            {() => {
              return <Toc title={title} toc={toc} />
            }}
          </Drawer>
        </>
      ) : (
        <div className="hidden xl:block xl:max-w-md xl:shrink-0 xl:grow-2">
          <div
            // ref={refTocWrapper}
            className={cn(
              "sticky top-20 max-h-fit min-h-9.5 transition-[height]",
              "no-scrollbar overflow-auto rounded-lg border border-dashed",
              "bg-card/50",
              "max-h-[calc(100dvh-64px-16px-16px)]",
            )}
          >
            <Toc title={title} toc={toc} />
          </div>
        </div>
      )}
    </div>
  )
}
