import fs from "fs/promises"
import path from "path"

import { CodeHikePre } from "./pre"
import { cn } from "@/lib/utils"

type CodeViewerProps = {
  file: string
  title?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  handlers?: string
  theme?: string
  collapsible?: boolean
  collapseToLine?: number
}

export async function CodeViewer({
  file,
  title,
  showLineNumbers,
  showCopyButton,
  handlers,
  theme,
  collapsible = false,
  collapseToLine,
}: CodeViewerProps) {
  const filePath = path.join(process.cwd(), file)
  const value = await fs.readFile(filePath, "utf-8")
  const lang = (path.extname(file) || "txt").slice(1)

  const rawMeta = cn(
    title ? `title="${title}"` : "",
    showLineNumbers ? "showLineNumbers" : "",
    showCopyButton ? "showCopyButton" : "",
    handlers ? `handlers="${handlers}"` : "",
    theme ? `theme="${theme}"` : "",
  )

  return (
    <>
      {/* <pre>{JSON.stringify({ filePath, lang }, undefined, 2)}</pre> */}
      <CodeHikePre
        codeblock={{ lang, meta: rawMeta, value: value.trim() }}
        collapsible={collapsible}
        collapseToLine={collapseToLine}
      />
    </>
  )
}
