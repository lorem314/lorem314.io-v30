import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import { loader } from "fumadocs-core/source"

import { blogCollections } from "fumadocs-mdx:collections/server"

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogCollections, []),
  slugs: (file) => {
    return [sanitizeSlug(file.path.replace(/\.mdx?$/, ""))]
  },
})

function sanitizeSlug(fileName: string): string {
  return (
    fileName
      // 1. 转为小写（对英文友好，URL 推荐全小写）
      .toLowerCase()
      // 2. 核心清洗：匹配所有不合规的字符。
      // [^\u4e00-\u9fa5a-digit_a-zA-Z\s-] 意思是：除了中文、英文、数字、下划线、空格、中划线以外的所有字符（如 !, `, @, # 等）
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s_-]/g, "")
      // 3. 将空格、下划线或者原本就有的特殊符号位置，替换为中划线
      .replace(/[\s_]+/g, "-")
      // 4. 将多个连续的中划线（比如原本是 "A !! B" 清洗后变成 "A---B"）合并为一个中划线 "A-B"
      .replace(/-+/g, "-")
      // 5. 去除首尾的多余中划线（比如文件名开头或结尾有空格/标点符号的情况）
      .replace(/^-+|-+$/g, "")
  )
}
