"use client"

import React from "react"
import { TagsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Search } from "@/features/blog/components/search"
import { Select } from "@/features/blog/components/select"
import { BlogList } from "@/features/blog/components/list"
import { AllTags } from "@/features/blog/components/all-tags"
import { Drawer, useDrawer } from "@/components/custom-ui/drawer"
import { ClientPortal } from "@/components/custom-ui/client-portal"
import { useContext } from "@/features/blog/components/context"

export default function Page() {
  const isRightDrawerAlwaysCollapsed = true

  const {
    isCollapsed: isRightDrawerCollapsed,
    isOpen: isRightDrawerOpen,
    handler: rightDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isRightDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 1536px)",
  })

  const showRightDrawerOpener =
    isRightDrawerAlwaysCollapsed || isRightDrawerCollapsed

  const { searchTerm, selectedTags, currentPage, isOrLogic } = useContext()

  const query = { searchTerm, selectedTags, isOrLogic, currentPage }
  const deferredQuery = React.useDeferredValue(query)

  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-12 gap-6">
      <Search />

      <Select />

      <BlogList
        className={cn(
          "col-span-full 2xl:col-span-8",
          isRightDrawerAlwaysCollapsed ? "2xl:col-span-full" : "",
        )}
        query={deferredQuery}
      />

      {showRightDrawerOpener ? (
        <>
          <ClientPortal targetId="right-drawer-anchor">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={rightDrawerHandler.open}
            >
              <TagsIcon />
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
              return (
                <div className="p-2.5">
                  <AllTags />
                </div>
              )
            }}
          </Drawer>
        </>
      ) : (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>所有标签</CardTitle>
          </CardHeader>
          <CardContent>
            <AllTags />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
