"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  Code2Icon,
  ImageIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { useContext } from "./context"
import { fetchBlogs } from "../data"
import { getRelativeTimeString } from "@/lib/formatter"
import type { BlogItem } from "@/types"

// const views = {
//   list: ListView,
//   grid: GridView,
// }

export const BlogList = ({
  className,
  query,
}: {
  className: string
  query: {
    searchTerm: string
    selectedTags: string[]
    isOrLogic: boolean
    currentPage: number
  }
}) => {
  const { pageSize, setCurrentPage, allBlogs } = useContext()

  const { results, totalPage } = React.use<{
    results: BlogItem[]
    totalPage: number
  }>(
    fetchBlogs(allBlogs, {
      searchTerm: query.searchTerm,
      selectedTags: query.selectedTags,
      isOrLogic: query.isOrLogic,
      currentPage: query.currentPage,
      pageSize,
    }),
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>博客</CardTitle>
      </CardHeader>
      <CardContent className="@container">
        <GridView items={results} />
      </CardContent>
    </Card>
  )
}

const GridView = ({ items }: { items: BlogItem[] }) => {
  if (items.length === 0) {
    return <NoResult />
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        "@xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4",
      )}
    >
      {items.map((item) => {
        return (
          <Link href={item.url} key={item.id}>
            <GridViewItem item={item} />
          </Link>
        )
      })}
    </div>
  )
}

const GridViewItem = ({ item }: { item: BlogItem }) => {
  return (
    <article
      className={cn(
        "group rounded-lg border",
        "shadow transition-shadow duration-300 hover:shadow-xl",
      )}
    >
      <GridViewItemHeader item={item} />
      <GridViewItemContent item={item} />
      <GridViewItemFooter item={item} />
    </article>
  )
}

const GridViewItemHeader = ({ item }: { item: BlogItem }) => {
  return (
    <header
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-t-lg",
      )}
    >
      <Image
        className={cn(
          "object-cover group-hover:scale-105",
          "transition-transform duration-300",
        )}
        src={item.cover || "/img/blog/default-cover.webp"}
        alt={item.title}
        loading="eager"
        sizes="(max-width: 768px) 100vw, 25vw"
        fill
      />
    </header>
  )
}

const GridViewItemContent = ({ item }: { item: BlogItem }) => {
  return (
    <section className="">
      {/* <div className="flex flex-wrap gap-2.5 px-2.5 pt-2.5">
        {item.tags.map((tag, index) => {
          return (
            <Badge key={index} variant="outline" className="">
              {tag}
            </Badge>
          )
        })}
      </div> */}
      <div
        className={cn(
          "flex flex-wrap items-start gap-x-1.5 gap-y-2",
          "mt-2.5 mb-2 h-17 px-2.5",
          "line-clamp-2",
        )}
      >
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "mx-0.5 my-1 inline-block rounded border px-2 py-0.5 text-sm",
            )}
          >
            {tag}
          </span>
        ))}
      </div>
      <h3
        className={cn(
          "mt-2 mb-2.5 line-clamp-2 h-12 px-4 text-base font-bold",
          "group-hover:text-link-foreground",
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground my-2.5 px-4 text-sm leading-relaxed",
          "line-clamp-5 min-h-[5lh]",
        )}
      >
        {item.description}
      </p>
    </section>
  )
}

const GridViewItemFooter = ({ item }: { item: BlogItem }) => {
  const items = [
    {
      icon: CalendarIcon,
      prefix: "",
      count: getRelativeTimeString(item.createdAt, new Date(), { space: true }),
      suffix: "",
    },
    {
      icon: FileTextIcon,
      prefix: "约 ",
      count: item.stats?.wordCount || 0,
      suffix: " 字",
    },
    {
      icon: Code2Icon,
      prefix: "",
      count: item.stats?.codeBlockCount || 0,
      suffix: " 代码块",
    },
    {
      icon: ImageIcon,
      prefix: "",
      count: item.stats?.imageCount || 0,
      suffix: " 图片",
    },
    // { icon: ClockIcon, prefix: "", count: 37, suffix: " 分钟阅读" },
  ]

  return (
    <footer
      className={cn(
        "mt-3 mb-4 border-t border-dashed pt-2.5",
        "flex flex-wrap items-center gap-2.5 px-2.5",
      )}
    >
      {items.map((item, index) => {
        return !item.count ? null : (
          <div
            key={index}
            className="text-muted-foreground flex items-center gap-1"
          >
            <item.icon size={14} />
            <span className="text-xs">
              {item.prefix}
              {item.count.toLocaleString()}
              {item.suffix}
            </span>
          </div>
        )
      })}
    </footer>
  )
}

const NoResult = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>无结果</EmptyTitle>
        <EmptyDescription>没有符合查询的文章...</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
