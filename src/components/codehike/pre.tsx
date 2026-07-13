import os from "node:os"

import {
  InnerLine,
  Pre,
  highlight,
  type AnnotationHandler,
  type BlockAnnotation,
  type RawCode,
} from "codehike/code"

import {
  Title,
  ActionsAnchor,
  CodeHikePreClient as Client,
  CodeHikePreProvider as Provider,
  CopyButton,
} from "./pre.client"
import { cn } from "@/lib/utils"

import { lineNumbers } from "./annotations/line-numbers"
import { mark } from "./annotations/mark"
import { callout } from "./annotations/callout"
import { diff } from "./annotations/diff"

const line: AnnotationHandler = {
  name: "line",
  Line: (props) => {
    // const showLineNumbers = props.data?.showLineNumbers || false
    // props.data 外部传来的 data 只能由 Block 接收 ？！这里是 Line
    // console.log("wtf", props.data?.wtf)
    return (
      <InnerLine
        merge={props}
        className={cn("pr-12 pl-2")}
        data-slot="line-Line"
      />
    )
  },
}

const handlerMap: { [key: string]: AnnotationHandler[] } = {
  callout: [callout],
  mark: [mark],
  diff: [diff],
  // className: [className],
  // fold: [fold],
  // hover: [hover],
  // collapse: [collapse, collapseTrigger, collapseContent],
  // tokenTransitions: [tokenTransitions],
  // focus: [focus],
}

type CodeHikePreProps = {
  className?: string
  codeblock: RawCode

  showCopyButton?: boolean
  showLineNumbers?: boolean

  collapsible?: boolean
  collapseToLine?: number
}

export async function CodeHikePre({
  className,
  codeblock,

  showCopyButton,
  showLineNumbers,

  // 是否启用折叠
  collapsible = false,

  // 折叠时 最多显示多少行代码行数
  collapseToLine = 24,
}: CodeHikePreProps) {
  const parsedMeta = parseMeta(codeblock.meta)

  const highlighted = await highlight(codeblock, parsedMeta.theme)

  const handlers: AnnotationHandler[] = [line]

  const usedHandlerNames = parsedMeta.handlers.split(" ")
  usedHandlerNames.forEach((handlerName) => {
    const handler = handlerMap[handlerName] as AnnotationHandler[] | undefined
    if (handler) handlers.push(...handler)
  })

  if (showLineNumbers || parsedMeta.showLineNumbers) {
    handlers.push(lineNumbers)
  }

  const lineCount = highlighted.code.split(/\r\n|\n|\r/).length
  const lineCountDigits = lineCount.toString().length
  const hasDiff = usedHandlerNames.includes("diff")
  const diffMinusLineNumbers: number[] = []

  highlighted.annotations.forEach((annotation) => {
    switch (annotation.name) {
      case "callout":
        annotation.data = {
          lineCountDigits,
          showLineNumbers: parsedMeta.showLineNumbers,
          hasDiff,
          //  hasCollapse,
        }
        break

      case "line":
        break

      case "diff":
        if (annotation.query === "-") {
          diffMinusLineNumbers.push(
            (annotation as BlockAnnotation).fromLineNumber,
          )
        }
        break

      default:
        break
    }
  })

  let textToCopy = ""
  if (showCopyButton || parsedMeta.showCopyButton) {
    highlighted.code.split(/\r\n|\n|\r/).forEach((line, index) => {
      if (!diffMinusLineNumbers.includes(index + 1)) {
        textToCopy += `${line}${os.EOL}`
      }
    })
  }

  return (
    <>
      {/* <pre>{JSON.stringify({}, undefined, 2)}</pre> */}

      <Provider
        shouldShowExpandButton={parsedMeta.collapsible || collapsible}
        lineCount={lineCount}
        collapseToLine={
          parsedMeta.collapseToLine
            ? parseInt(parsedMeta.collapseToLine)
            : collapseToLine
        }
      >
        <figure className={cn("my-6! rounded-lg border shadow", className)}>
          {showCopyButton || parsedMeta.showCopyButton ? (
            <CopyButton text={textToCopy} />
          ) : null}

          <Title
            title={parsedMeta.title}
            style={{
              color: highlighted.style.color,
              background: highlighted.style.background,
            }}
          />

          <div className="relative">
            <Client>
              <Pre
                className={cn(
                  "not-prose",
                  "no-scrollbar font-fira grow overflow-auto",
                  "rounded-b-lg py-3 pr-0 pl-0.5 text-sm leading-6",
                  parsedMeta.title ? "rounded-t-none" : "rounded-t-lg",
                  "data-annotation-mark:pl-0",
                )}
                style={highlighted.style}
                code={highlighted}
                handlers={handlers}
                data-annotation-line-numbers={
                  parsedMeta.showLineNumbers ? "" : undefined
                }
                data-annotation-mark={
                  usedHandlerNames.includes("mark") ? "" : undefined
                }
              />

              <ActionsAnchor />
            </Client>
          </div>
        </figure>
      </Provider>
    </>
  )
}

const defaultMeta = {
  title: "",
  showLineNumbers: false,
  showCopyButton: false,
  theme: "github-from-css" as const,
  handlers: "",
  collapsible: false,
  collapseToLine: "",
}

export const parseMeta = (rawMeta: string) => {
  if (!rawMeta) return defaultMeta

  const iterator = rawMeta.matchAll(/([a-zA-Z]+)(?:="(.+?)")?/g)
  const meta: { [key: string]: string | boolean } = {}

  for (const match of iterator) {
    const key = match[1]
    const value = match[2]

    if (!(key in defaultMeta)) continue

    if (value === undefined || value === "true") meta[key] = true
    else if (value === "false") meta[key] = false
    else meta[key] = value
  }
  return { ...defaultMeta, ...meta }
}
