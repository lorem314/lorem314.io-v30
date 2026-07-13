"use client"

import React from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import { ChevronsDownUpIcon, CopyIcon, CopyCheckIcon } from "lucide-react"

import { Button } from "../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMounted } from "@/hooks/use-mounted"

// Title CopyButton ActionsAnchor used in CodeHikePre
export const Title = ({
  className,
  style,
  title,
}: {
  className?: string
  style?: React.CSSProperties
  title: string | undefined
}) => {
  if (!title?.trim()) {
    return null
  }

  return (
    <figcaption
      className={cn(
        "mt-0 rounded-t-lg border-b border-dashed px-2.5 py-2 font-mono",
        className,
      )}
      style={style}
    >
      {title}
    </figcaption>
  )
}

export const CopyButton = ({ text }: { text: string }) => {
  const context = useCodeHikePreContext()
  const isMounted = useIsMounted()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    try {
      navigator.clipboard.writeText(text)
      setIsCopied(true)
      setIsOpen(true)
      toast.success("代码已复制", { position: "top-right" })
      setTimeout(() => {
        setIsCopied(false)
      }, 1500)
    } catch (error) {
      toast.error("复制代码失败", { position: "top-right" })
    }
  }, [text])

  if (!isMounted || !context.actionsAnchorRef.current) {
    return null
  }

  return createPortal(
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm" onClick={handleCopy}>
          {isCopied ? (
            <CopyCheckIcon className="text-green-600 dark:text-green-400" />
          ) : (
            <CopyIcon />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={"left"}>
        {isCopied ? <p>已复制</p> : <p>复制代码</p>}
      </TooltipContent>
    </Tooltip>,
    context.actionsAnchorRef.current,
  )
}

export const ActionsAnchor = () => {
  const { actionsAnchorRef, shouldShowExpandButton, isExpanded } =
    useCodeHikePreContext()

  return (
    <div className={cn("absolute top-0 right-0 h-full bg-transparent p-2.5")}>
      <div
        ref={actionsAnchorRef}
        data-slot="chp-actions-ref"
        className={cn(
          "sticky",
          "top-[calc(var(--header-height)+10px)]",
          "flex flex-col gap-2.5",
        )}
      ></div>
    </div>
  )
}

export const CodeHikePreClient = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { shouldShowExpandButton, isExpanded, collapseToLine } =
    useCodeHikePreContext()

  return (
    <div
      className={cn(
        "rounded-b-lg",
        !shouldShowExpandButton || (shouldShowExpandButton && isExpanded)
          ? "max-h-fit overflow-y-visible"
          : `overflow-y-hidden`,
      )}
      style={{
        maxHeight:
          shouldShowExpandButton && !isExpanded
            ? `calc(${collapseToLine * 24}px + 12px)`
            : "",
      }}
    >
      <div>{children}</div>

      {shouldShowExpandButton && !isExpanded ? <ExpandButton /> : null}

      {shouldShowExpandButton && isExpanded ? <CollapseButton /> : null}
    </div>
  )
}

const ExpandButton = () => {
  const { setIsExpanded, collapseToLine, lineCount } = useCodeHikePreContext()

  return (
    <div
      className={cn(
        "absolute right-0 bottom-0 left-0 h-14",
        "from-background bg-linear-to-t to-transparent",
        "flex justify-center rounded-b-lg",
      )}
    >
      <Button variant="outline" onClick={() => setIsExpanded(true)}>
        展开隐藏的 {lineCount - collapseToLine} 行代码
      </Button>
    </div>
  )
}

const CollapseButton = () => {
  const { setIsExpanded, actionsAnchorRef } = useCodeHikePreContext()

  if (!actionsAnchorRef.current) return null

  return createPortal(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setIsExpanded(false)}
        >
          <ChevronsDownUpIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={"left"}>折叠代码</TooltipContent>
    </Tooltip>,
    actionsAnchorRef.current,
  )
}

type CodeHikePreContextProps = {
  actionsAnchorRef: React.RefObject<null | HTMLDivElement>
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  shouldShowExpandButton: boolean
  lineCount: number
  collapseToLine: number
}

const CodeHikePreContext = React.createContext<
  CodeHikePreContextProps | undefined
>(undefined)

export const CodeHikePreProvider = ({
  children,
  shouldShowExpandButton,
  lineCount,
  collapseToLine,
}: Readonly<{
  children: React.ReactNode
  shouldShowExpandButton: boolean
  lineCount: number
  collapseToLine: number
}>) => {
  const actionsAnchorRef = React.useRef<HTMLDivElement | null>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <CodeHikePreContext.Provider
      value={{
        actionsAnchorRef,
        isExpanded,
        setIsExpanded,
        shouldShowExpandButton,
        lineCount,
        collapseToLine,
      }}
    >
      {children}
    </CodeHikePreContext.Provider>
  )
}

function useCodeHikePreContext() {
  const context = React.useContext(CodeHikePreContext)

  if (!context) {
    throw new Error(
      "context has to be used within <CodeHikePreProvider.Provider>",
    )
  }

  return context
}
