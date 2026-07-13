import React from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getRelativeTimeString, getDateTimeString } from "@/lib/formatter"

export default function Page() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>测试页面</CardTitle>
      </CardHeader>
      <CardContent>
        <div>{getRelativeTimeString(new Date("2026-04-01"))}</div>
        <div>{getDateTimeString(new Date("2026-04-01"), { space: true })}</div>
        <div>
          {new Intl.DateTimeFormat("zh", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date("2008-05-21"))}
        </div>
      </CardContent>
    </Card>
  )
}
