import { defineCollections, defineConfig } from "fumadocs-mdx/config"
import { remarkImage } from "fumadocs-core/mdx-plugins"
import {
  remarkCodeHike,
  recmaCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeUnwrapImages from "rehype-unwrap-images"

import { blogFrontmatter } from "@/lib/schema"
import { mdxStats } from "@/plugins/mdx-stats"

export const blogCollections = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: blogFrontmatter,
})

const chConfig: CodeHikeConfig = {
  components: {
    code: "CodeHikePre",
  },
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [
      ...v,
      remarkMath,
      [remarkImage, { useImport: false, publicDir: "./public" }],
      [remarkCodeHike, chConfig],
      mdxStats,
    ],

    recmaPlugins: [[recmaCodeHike, chConfig]],

    rehypePlugins: (v) => [rehypeKatex, rehypeUnwrapImages, ...v],
  },
})
