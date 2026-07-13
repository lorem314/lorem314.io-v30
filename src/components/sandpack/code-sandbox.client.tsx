"use client"

import { useEffect, useState } from "react"
import {
  SandpackCodeEditor,
  useSandpack,
  SandpackProvider,
  SandpackFiles,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react"
import { RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { CodeSandboxProps } from "./code-sandbox"
import { useGlobalContext } from "../layout/context"

type CodeSandboxClientProps = Omit<
  CodeSandboxProps,
  "folder" | "files" | "title" | "previewHeight"
> & {
  files: SandpackFiles
  children: React.ReactNode
}

export const CodeSandboxClient = ({
  files,

  template,
  options,
  customSetup,

  children,
}: CodeSandboxClientProps) => {
  const globalContext = useGlobalContext()

  return (
    <SandpackProvider
      theme={globalContext.theme}
      template={template}
      files={files}
      customSetup={{
        ...customSetup,
        // dependencies: {
        //   react: "19.1.0", // 或者 "19.2.0"，选一个稳定版本
        //   "react-dom": "19.1.0", // 必须和上面完全一样
        // },
        // devDependencies: {
        //   "@types/react": "^19.1.0",
        //   "@types/react-dom": "^19.1.0",
        // },
        // npmRegistries.proxyEnabled: cause error when set to `true`
        // `true` for public or third-party registries like the main npm registry or mirror registries, it bypasses browser CORS errors and optimizes loading speeds through their CDN
        // `false` for connecting to your own self-hosted private npm registry (like Verdaccio) to prevent exposing your internal server or credentials to the CodeSandbox proxy
        npmRegistries: [
          {
            enabledScopes: [],
            limitToScopes: false,
            registryUrl: "https://registry.npmmirror.com",
            proxyEnabled: false,
          },
        ],
      }}
      options={{
        ...options,
        bundlerURL: "https://sandpack.lorem314.site",
        initMode: "user-visible",
        recompileMode: "immediate",
      }}
    >
      {children}
    </SandpackProvider>
  )
}

export const Title = ({ title }: { title?: string }) => {
  // const { listen } = useSandpack()
  // const { refresh } = useSandpackNavigation()
  // const [isRefreshing, setIsRefreshing] = useState(false)

  // useEffect(() => {
  //   const unsubscribe = listen((data) => {
  //     if (data.type === "start" || data.type === "refresh") {
  //       setIsRefreshing(true)
  //     } else if (data.type === "done") {
  //       setIsRefreshing(false)
  //     }
  //   })

  //   return () => unsubscribe()
  // }, [listen])

  return (
    <div
      className={cn(
        "border-muted rounded-t-lg border-b px-4 py-2.5 text-sm",
        "text-muted-foreground flex items-center justify-between",
      )}
    >
      <div>{title || "代码沙盒"}</div>
      {/* <div>
        <Button
          variant="outline"
          size="icon-xs"
          disabled={isRefreshing}
          onClick={() => {
            setIsRefreshing(true)
            refresh()
          }}
        >
          <RotateCwIcon />
        </Button>
      </div> */}
    </div>
  )
}

export const FileTabs = () => {
  const { sandpack } = useSandpack()

  const setActiveFile = (event: React.MouseEvent) => {
    const file = event.currentTarget.getAttribute("data-file")
    if (!file || sandpack.activeFile === file) return
    sandpack.setActiveFile(file)
  }

  // if (false) {
  //   return (
  //     <div className="border-t pb-px">
  //       {/* <pre>
  //         {JSON.stringify(
  //           { visibleFiles: sandpack.visibleFiles },
  //           undefined,
  //           2,
  //         )}
  //       </pre> */}
  //       {sandpack.visibleFiles.map((file) => {
  //         const splitted = file.split("/")
  //         const isActive = file === sandpack.activeFile
  //         return (
  //           <Button
  //             className={cn(
  //               "rounded-none",
  //               isActive
  //                 ? "text-foreground border-primary border-b-2 border-x-transparent border-t-transparent"
  //                 : "text-muted-foreground",
  //             )}
  //             variant={"ghost"}
  //             data-file={file}
  //             key={file}
  //           >
  //             {splitted.at(-1)}
  //           </Button>
  //         )
  //       })}
  //     </div>
  //   )
  // }

  return (
    <Tabs
      className="border-muted border-t"
      defaultValue={sandpack.activeFile}
      value={sandpack.activeFile}
    >
      {/* <pre>
        {JSON.stringify({ activeFile: sandpack.activeFile }, undefined, 2)}
      </pre> */}
      <TabsList variant="line" className="p-0.5">
        {sandpack.visibleFiles.map((file) => {
          const splitted = file.split("/")
          return (
            <TabsTrigger
              data-file={file}
              key={file}
              value={file}
              onClick={setActiveFile}
            >
              {splitted.at(-1)}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export const CodeEditor = () => {
  return (
    <div className="mt-1">
      <SandpackCodeEditor
        className="text-sm"
        showTabs={false}
        showLineNumbers
      />
    </div>
  )
}
