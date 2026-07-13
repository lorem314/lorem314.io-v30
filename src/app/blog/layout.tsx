import Link from "next/link"
import type { Metadata } from "next"

import { blogSource } from "@/lib/source"
import type { BlogItem, BlogTagCountMap } from "@/types"

import { ContextProvider } from "@/features/blog/components/context"

const allBlogs: BlogItem[] = blogSource.getPages().map((page) => {
  return {
    id: page.path,
    url: page.url,
    title: page.data.title,
    tags: page.data.tags,
    createdAt: page.data.createdAt,
    description: page.data.description,
    cover: page.data.cover,
    bvid: page.data.bvid,
    stats: page.data.stats,
  }
})

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tagCountMap: BlogTagCountMap = getBlogTagCountMap(allBlogs)

  // console.log("allBlogs", blogSource.getPages())
  return (
    <ContextProvider allBlogs={allBlogs} tagCountMap={tagCountMap}>
      {children}
    </ContextProvider>
  )
}

export const metadata: Metadata = {
  title: "博客 - lorem314.io",
}

const getBlogTagCountMap = (blogs: BlogItem[]) => {
  const tagMap = new Map<string, number>()

  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      const currentCount = tagMap.get(tag) || 0
      tagMap.set(tag, currentCount + 1)
    })
  })

  return tagMap
}
