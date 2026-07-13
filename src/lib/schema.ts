import z from "zod"

export const blogFrontmatter = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  description: z.string(),
  cover: z.string().default("/img/blog/default-cover.webp"),
  bvid: z.string().optional(),
  stats: z
    .object({
      wordCount: z.number(),
      codeBlockCount: z.number(),
      imageCount: z.number(),
    })
    .optional(),
})
