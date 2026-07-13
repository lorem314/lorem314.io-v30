import Image from "next/image"
import type { MDXContent } from "mdx/types"
import { ExternalLinkIcon } from "lucide-react"

import {
  CollapsibleTitle,
  Collapsible,
  CollapsibleContent,
} from "../custom-ui/collapsible"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { ImageZoom } from "../image-zoom"

import { Link } from "../custom-ui/link"
import { CodeHikePre } from "../codehike/pre"
import { CodeViewer } from "../codehike/code-viewer"
import { CodeWithTabs } from "../codehike/code-with-tabs"
import { CodeSandbox } from "../sandpack/code-sandbox"
import { NpmTabs } from "../codehike/npm-tabs"
import { BilibiliIcon } from "../custom-ui/icons"

import {
  H2,
  H3,
  H4,
  H5,
  H6,
  InlineCode,
  P,
  BlockQuote,
  MdxImage,
} from "../custom-ui/typography"

export const Body = ({ Content }: { Content: MDXContent }) => {
  return (
    <Content
      components={{
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
        p: P,
        blockquote: BlockQuote,
        code: InlineCode,
        a: Link,
        img: (props: any) => <ImageZoom {...props} />,
        MdxImage,

        Collapsible,
        CollapsibleTitle,
        CollapsibleContent,

        Kbd,
        KbdGroup,

        CodeHikePre,
        CodeViewer,
        CodeWithTabs,
        NpmTabs,

        CodeSandbox,
      }}
    />
  )
}

export const BilibiliSection = ({ bvid }: { bvid?: string }) => {
  if (!bvid) return null

  return (
    <Item
      variant="outline"
      asChild
      className="not-prose text-link-foreground my-6 first:mt-0"
    >
      <a
        href={`https://www.bilibili.com/video/${bvid}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemMedia variant="icon">
          <BilibiliIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>在 Bilibili 上观看该博客的讲解视频</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon className="size-4" />
        </ItemActions>
      </a>
    </Item>
  )
}

export const BlogCover = ({ cover }: { cover: string }) => {
  if (!cover || cover.split("/").at(-1) === "default-cover.webp") {
    return null
  }

  return (
    <>
      {/* <pre>{JSON.stringify({ cover })}</pre> */}
      <div className="relative my-4 aspect-video overflow-hidden rounded-lg">
        <Image
          className="not-prose"
          src={cover}
          alt=""
          loading="eager"
          sizes="(max-width: 768px) 100vw, 25vw"
          fill
        />
      </div>
    </>
  )
}

export const BlogDescription = () => {}
