import fs from "node:fs/promises"
import path from "node:path"

import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { RawCode } from "codehike/code"
import { z } from "zod"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { CodeHikePre } from "./pre"

const Schema = Block.extend({
  tabs: z.array(CodeBlock),
  showLineNumbers: z.boolean().optional().default(false),
  showCopyButton: z.boolean().optional().default(false),
})

// type CodeWithTabsProps = z.infer<typeof Schema>

// 用在 MDX 文件中
export async function CodeWithTabs(props: any) {
  const { tabs } = parseProps(props, Schema) as { tabs: RawCode[] }

  return (
    <>
      <CodeTabs
        tabs={tabs}
        showCopyButton={props.showCopyButton}
        showLineNumbers={props.showLineNumbers}
      />
    </>
  )
}

// 用在 React 组件中
export async function CodeViewerWithTabs({
  files,
}: {
  files: { path: string; title: string; meta?: string }[]
}) {
  const tabs = await Promise.all(
    files.map(async (file) => {
      const fileContent = await fs.readFile(
        path.join(process.cwd(), file.path),
        "utf-8",
      )
      const fileName = file.path.split("/").at(-1)
      const lang = fileName ? fileName.split(".").at(-1) || "txt" : "txt"
      // return { lang, meta: file.meta || "", value: fileContent }
      return {
        title: file.title,
        content: fileContent,
        path: file.path,
        lang,
        meta: file.meta || "",
      }
    }),
  )

  return (
    <div className="my-6 last:mb-0" data-slot="code-viewer-with-tabs">
      <Tabs defaultValue={tabs[0].path}>
        <TabsList variant="line">
          {tabs.map((tab) => {
            return (
              <TabsTrigger key={tab.path} value={tab.path}>
                {tab.title}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {tabs.map((tab) => {
          return (
            <TabsContent key={tab.path} value={tab.path}>
              <CodeHikePre
                className="my-0!"
                codeblock={{
                  lang: tab.lang,
                  meta: tab.meta,
                  value: tab.content,
                }}
              />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

async function CodeTabs(props: {
  tabs: RawCode[]
  showCopyButton?: boolean
  showLineNumbers?: boolean
}) {
  const tabs = props.tabs.map((tab, index) => {
    const [title, ...restMeta] = tab.meta.split(" ")
    return {
      value: tab.value,
      lang: tab.lang,
      meta: restMeta.join(" "),
      title: title || index.toString(),
    }
  })

  return (
    <Tabs defaultValue={tabs[0].title}>
      <TabsList variant="line">
        {tabs.map((tab) => {
          return (
            <TabsTrigger key={tab.title} value={tab.title}>
              {tab.title}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabs.map((tab) => {
        return (
          <TabsContent key={tab.title} value={tab.title}>
            <CodeHikePre
              className="my-0!"
              codeblock={{
                value: tab.value,
                lang: tab.lang,
                meta: tab.meta,
              }}
            />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
