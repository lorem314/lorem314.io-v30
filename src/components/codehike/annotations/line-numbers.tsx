import { AnnotationHandler, InnerLine } from "codehike/code"
import { cn } from "@/lib/utils"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 2
    return (
      <div className="flex" data-slot="lineNumbers-Line">
        <span
          className={cn(
            "text-right select-none",
            "text-muted-foreground/60 pr-[1ch]", // custom add
            "", // custom add
            "",
          )}
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine
          merge={props}
          className={cn(
            "flex-1",
            // "pl-2", // custom comment
          )}
        />
      </div>
    )
  },
}
