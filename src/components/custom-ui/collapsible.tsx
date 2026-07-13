"use client"

import React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type CollapsibleContextProps = {
  isOpen: boolean
}

const CollapsibleContext = React.createContext<
  CollapsibleContextProps | undefined
>(undefined)

export const Collapsible = ({
  children,
  defaultIsOpen,
}: {
  children: React.ReactNode
  defaultIsOpen: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen ?? false)

  return (
    <CollapsibleContext.Provider value={{ isOpen }}>
      <ShadcnCollapsible
        className="my-6 rounded-lg border"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        {children}
      </ShadcnCollapsible>
    </CollapsibleContext.Provider>
  )
}

export const CollapsibleTitle = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const context = React.useContext(CollapsibleContext)

  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <div className="grow [&>p]:my-0 [&>p]:py-2.5">{children}</div>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <ChevronsUpDown />
          <span className="sr-only">Toggle details</span>
        </Button>
      </CollapsibleTrigger>
    </div>
  )
}

export const CollapsibleContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ShadcnCollapsibleContent className="*:m-0 *:px-2.5 [&>ul]:pl-10">
      {children}
    </ShadcnCollapsibleContent>
  )
}
