import fs from "node:fs/promises"
import path from "node:path"

import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackProviderProps,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CodeHikePre } from "../codehike/pre"
import { Title, FileTabs, CodeEditor } from "./code-sandbox.client"

// import { readFile } from "@/lib/helper"
import { CodeSandboxClient } from "./code-sandbox.client"

export type CodeSandboxProps = {
  folder: string
  files: Record<string, boolean | string>
  title?: string
  readOnly?: boolean
  previewHeight?: string

  template?: SandpackProviderProps["template"]
  options?: SandpackProviderProps["options"]
  customSetup?: SandpackProviderProps["customSetup"]
}

export async function CodeSandbox({
  folder,
  files,
  title,
  readOnly = true,
  previewHeight = "300px",

  template,
  options,
  customSetup,
}: CodeSandboxProps) {
  const prefix = path.join(process.cwd(), "content", "sandbox")

  const sandpackFiles: Record<string, string> = await Promise.all(
    Object.entries(files).map(async ([filePath, value]) => {
      const content =
        typeof value === "string"
          ? await fs.readFile(path.join(prefix, folder, value), "utf-8")
          : value
            ? await fs.readFile(path.join(prefix, folder, filePath), "utf-8")
            : ""
      return { content, path: filePath }
    }),
  ).then((files) => {
    return files
      .filter((file) => {
        return file.content ? true : false
      })
      .reduce((files, { path, content }) => {
        return { ...files, [path]: content.trim() }
      }, {})
  })

  return (
    <div className="my-4">
      {/* <pre>{JSON.stringify({ sandpackFiles }, undefined, 2)}</pre> */}

      <CodeSandboxClient
        files={sandpackFiles}
        template={template}
        options={options}
        customSetup={customSetup}
      >
        <SandpackLayout
          className={cn(
            "bg-background! text-foreground! block!",
            "border-border! box-border! rounded-lg!",
            "shadow",
            readOnly ? "overflow-visible!" : "",
          )}
        >
          <Title title={title} />

          <SandpackPreview
            className=""
            style={{ height: previewHeight }}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />

          {readOnly ? (
            <Tabs
              className="border-muted border-t"
              defaultValue={options?.activeFile}
            >
              <TabsList variant="line" className="p-0.5">
                {Object.keys(sandpackFiles).map((fileName) => {
                  if (
                    options?.visibleFiles &&
                    !options?.visibleFiles.includes(fileName)
                  ) {
                    return null
                  }
                  const splitted = fileName.split("/")
                  return (
                    <TabsTrigger key={fileName} value={fileName}>
                      {splitted.at(-1)}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              {Object.entries(sandpackFiles).map(([fileName, fileContent]) => {
                if (
                  options?.visibleFiles &&
                  !options?.visibleFiles.includes(fileName)
                ) {
                  return null
                }
                const lang = fileName.split(".").at(-1) || "txt"
                return (
                  <TabsContent
                    className="no-scrollbar max-h-160 overflow-y-auto rounded-b-lg"
                    key={fileName}
                    value={fileName}
                  >
                    <CodeHikePre
                      className={cn(
                        "my-0! border-none shadow-none",
                        "**:data-[slot=chp-actions-ref]:top-0",
                      )}
                      codeblock={{
                        value: fileContent,
                        lang,
                        meta: "shouLineNumbers",
                      }}
                      showCopyButton
                      showLineNumbers
                    />
                  </TabsContent>
                )
              })}
            </Tabs>
          ) : (
            <>
              <FileTabs />
              <CodeEditor />
            </>
          )}
        </SandpackLayout>
      </CodeSandboxClient>
    </div>
  )
}
