"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useContext } from "./context"

export function AllTags() {
  const { selectedTags, onSelectTag, tagCountMap } = useContext()

  return (
    <ul className="flex flex-wrap gap-2.5">
      {Array.from(tagCountMap.keys()).map((tag, index) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <li key={index}>
            <Button
              className=""
              variant={isSelected ? "default" : "outline"}
              onClick={onSelectTag(tag)}
            >
              <span className="pr-px">{tag}</span>
              {/* <Separator
                orientation="vertical"
                className="border-r border-dashed"
              /> */}
              <span className="w-px self-stretch border-r border-dashed" />
              <span className="pl-px">{tagCountMap.get(tag)}</span>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
