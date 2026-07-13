import z from "zod"

// import { blogSource } from "@/lib/source"
import { blogFrontmatter } from "@/lib/schema"

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type PickByType<T extends Record<PropertyKey, any>, U> = {
  [K in keyof T as T[K] extends U ? K : never]: U
}

// type BlogPage = ReturnType<typeof blogSource.getPages>[number]

type BlogFrontmatter = z.infer<typeof blogFrontmatter>

export type BlogItem = Prettify<{ id: string; url: string } & BlogFrontmatter>

export type BlogTagsStat = {
  name: string
  count: number
}[]

export type BlogTagCountMap = Map<string, number>

export type Theme = "light" | "dark"
export type PreferredTheme = Theme | "system"
