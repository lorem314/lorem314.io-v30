import { InlineAnnotation, AnnotationHandler } from "codehike/code"
import { cn } from "@/lib/utils"

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: {
        ...data,
        column: (fromColumn + toColumn) / 2,
        queryLength: query.length,
      },
    }
  },
  Block: ({ annotation, children }) => {
    const { column, lineCountDigits, showLineNumbers, queryLength, hasDiff } =
      annotation.data

    // const marginLeft = getCalloutMarginLeft(column, queryLength)
    // const marginLeft = column - queryLength * 0.5
    // const marginLeft = "16"

    const arrowLeft = [`${column}ch`]

    arrowLeft.push("-8px")
    // 这里的 -8 是自定义 line Annotation 上每行的 pl-2
    // if pl-4 then -0px

    // arrowLeft.push(`-${marginLeft}ch`)

    if (showLineNumbers) {
      arrowLeft.push(`${lineCountDigits + 2}ch`)
    }
    if (hasDiff) {
      arrowLeft.push(`1ch + 8px`)
    }

    return (
      <>
        {children}
        <div
          style={{
            minWidth: `${column + 4}ch`,
            marginLeft: `calc(${["8px"].join(" + ")})`,
          }}
          className={cn(
            "relative my-1 mr-4 rounded px-2",
            "border-border border whitespace-break-spaces",
            "bg-card text-secondary-foreground/80",
            "w-fit",
            // "max-w-[64ch]",
            // "ml-[8px]", // compensate -8px
            // `ml-[calc(8px+${marginLeft}px)]`,
          )}
        >
          <div
            style={{
              left: `calc(${arrowLeft.join(" + ")})`,
            }}
            className={cn(
              "absolute -top-px h-2 w-2 -translate-y-1/2 rotate-45",
              "bg-card border-t border-l border-current",
              "text-border",
            )}
          />
          {annotation.query}
          {/* <pre className="mt-0! mb-2! w-fit">
            {JSON.stringify(
              { column, left, queryLength, lineCountDigits },
              undefined,
              2,
            )}
          </pre> */}
        </div>
      </>
    )
  },
}

// function getCalloutMarginLeft(column: number, queryLength: number): number {
//   const MIN_MARGIN = 2.5
//   const MAX_MARGIN = 40

//   let margin = column * 0.58 - 3.2

//   const columnFactor = Math.max(0, (column - 12) / 45)
//   const lengthAdjustment = queryLength * 0.62 * columnFactor

//   margin -= lengthAdjustment

//   margin = Math.max(MIN_MARGIN, margin)
//   margin = Math.min(MAX_MARGIN, margin)

//   return Math.round(margin * 10) / 10 // 保留一位小数，适合 CodeHike
// }

// const compensate = (column: number, queryLength: number) => {
//   if (0 <= column && column < 20) {
//     return { marginLeft: `10ch` }
//   } else if (20 <= column && column < 40) {
//     return { marginLeft: `20ch + ${queryLength / 10}ch` }
//   } else if (40 <= column && column < 60) {
//     return { marginLeft: "50ch" }
//   } else {
//     return { marginLeft: "" }
//   }
// }
