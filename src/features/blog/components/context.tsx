"use client"

import React from "react"

import type { BlogItem, BlogTagCountMap } from "@/types"

type ViewMode = "list" | "grid"

type ContextProps = {
  allBlogs: BlogItem[]
  tagCountMap: BlogTagCountMap

  searchTerm: string
  onSearchTermChange: (value: string) => void

  selectedTags: string[]
  onSelectTag: (
    tag: string,
  ) => (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLButtonElement>
      | KeyboardEvent,
  ) => void
  clearSelectedTags: () => void

  isOrLogic: boolean
  setIsOrLogic: React.Dispatch<React.SetStateAction<boolean>>
  toggleIsOrLogic: () => void

  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  pageSize: number

  // viewMode: ViewMode
  // setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>
}

const Context = React.createContext<ContextProps>({
  allBlogs: [],
  tagCountMap: new Map(),

  searchTerm: "",
  onSearchTermChange: () => {},

  selectedTags: [],
  onSelectTag: () => () => {},
  clearSelectedTags: () => {},

  isOrLogic: false,
  setIsOrLogic: () => {},
  toggleIsOrLogic: () => {},

  currentPage: 1,
  setCurrentPage: () => {},
  pageSize: 12,

  // viewMode: "list",
  // setViewMode: () => {},
})

export function ContextProvider({
  allBlogs,
  tagCountMap,
  children,
}: Readonly<{
  allBlogs: BlogItem[]
  tagCountMap: BlogTagCountMap
  children: React.ReactNode
}>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [isOrLogic, setIsOrLogic] = React.useState(true)

  const pageSize = 8
  const [currentPage, setCurrentPage] = React.useState(1)

  // const [viewMode, setViewMode] = React.useState<ViewMode>("list")

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelectTag =
    (tag: string) =>
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.MouseEvent<HTMLButtonElement>
        | KeyboardEvent,
    ) => {
      setSelectedTags((prevSelectedTags) => {
        const hasSelected = prevSelectedTags.includes(tag)
        setCurrentPage(1)
        if (hasSelected) {
          // event.stopPropagation()
          return prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
        } else {
          if (event.shiftKey) return [...prevSelectedTags, tag]
          else return [tag]
        }
      })
    }

  const clearSelectedTags = () => setSelectedTags([])

  const toggleIsOrLogic = () => {
    setIsOrLogic((prev) => !prev)
  }

  const query = { searchTerm, selectedTags, isOrLogic, currentPage }
  const deferredQuery = React.useDeferredValue(query)

  return (
    <Context.Provider
      value={{
        allBlogs,
        tagCountMap,

        searchTerm,
        onSearchTermChange: handleSearchTermChange,

        selectedTags,
        onSelectTag: handleSelectTag,
        clearSelectedTags,

        isOrLogic,
        setIsOrLogic,
        toggleIsOrLogic,

        currentPage,
        setCurrentPage,
        pageSize,

        // viewMode,
        // setViewMode,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useContext() {
  const context = React.useContext(Context)
  if (!context) {
    throw new Error("useContext must be used within a <Context.Provider />")
  }
  return context
}
