import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"

import { blogSource } from "@/lib/source"

import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { Body, BilibiliSection, BlogCover } from "@/components/article/body"
import { Layout } from "@/components/article/layout"
import { BreadcrumbNav } from "@/components/custom-ui/breadcrumb-nav"
import { GridOverlay } from "@/components/custom-ui/grid-overlay"
import { H1 } from "@/components/custom-ui/typography"
import { getDateTimeString } from "@/lib/formatter"

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  const blog = blogSource.getPage([params.slug])

  if (!blog) return notFound()

  return (
    <>
      <div className="mx-auto my-4 max-w-7xl">
        <BreadcrumbNav
          className="px-2.5"
          items={[
            { title: "主页", href: "/" },
            { title: "博客", href: "/blog" },
            { title: blog.data.title },
          ]}
        />
      </div>

      <header
        className={cn(
          "border-muted relative border shadow-sm",
          "mx-auto mb-6 max-w-7xl rounded-xl px-8 py-10",
        )}
      >
        <GridOverlay
          offsetX={`${Math.floor(Math.random() * 24)}px`}
          offsetY={`${Math.floor(Math.random() * 24)}px`}
        />

        <H1 className="mb-6">{blog.data.title}</H1>

        <div className="my-4 flex flex-wrap items-center gap-2.5">
          {blog.data.tags.map((tag, index) => {
            return (
              <Badge
                key={index}
                variant="outline"
                className="bg-card z-10 rounded-lg px-2.5 py-4 text-sm"
              >
                {tag}
              </Badge>
            )
          })}
        </div>

        <p className="text-muted-foreground">
          发布于 {getDateTimeString(blog.data.createdAt, { space: true })}
        </p>
      </header>

      <Layout title={blog.data.title} toc={blog.data.toc}>
        <div
          className={cn(
            "prose prose-zinc dark:prose-invert mx-auto max-w-[72ch]",
          )}
        >
          <BlogCover cover={blog.data.cover} />

          <p className="lead">{blog.data.description}</p>

          <BilibiliSection bvid={blog.data.bvid} />

          {/* <pre>
            {JSON.stringify({ blogData: blog.data.bvid }, undefined, 2)}
          </pre> */}

          <Body Content={blog.data.body} />
        </div>
      </Layout>

      {/* <footer
        className={cn("mx-auto mt-6 flex max-w-7xl flex-col gap-4 md:flex-row")}
      >
        <Item variant="outline" asChild className="flex-row-reverse">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ItemContent className="items-end">
              <ItemTitle>External resource</ItemTitle>
              <ItemDescription className="">
                Opens in a new tab with security attributes.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronLeftIcon className="size-4" />
            </ItemActions>
          </a>
        </Item>
        <Item variant="outline" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ItemContent>
              <ItemTitle>External resource</ItemTitle>
              <ItemDescription>
                Opens in a new tab with security attributes.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </a>
        </Item>
      </footer> */}
    </>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const blog = blogSource.getPage([params.slug])

  if (!blog) return { title: "404 - lorem314.io" }

  return {
    title: `${blog.data.title} - 博客 - lorem314.io`,
  }
}
