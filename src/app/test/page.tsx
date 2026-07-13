"use client"

import React from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

function getMarginByQueryLength(queryLength: number): number {
  const baseMargin = 18 // query 为空/很短时的起始 margin
  const k = 0.65 // 衰减速度（可调）

  let margin = baseMargin - k * queryLength
  return Math.max(0, Math.round(margin * 10) / 10) // 保留一位小数
}

function getMarginByColumn(column: number): number {
  const MIN_MARGIN = 2.5
  const MAX_MARGIN = 38

  // 线性关系：marginLeft 大致随 column 增大而增大
  // 基础公式：让 marginLeft 比 column 稍微小一些
  let margin = column * 0.65 - 4.5 // 系数和偏移可调

  // 边界限制
  margin = Math.max(MIN_MARGIN, margin)
  margin = Math.min(MAX_MARGIN, margin)

  return Math.round(margin * 10) / 10 // 保留一位小数
}

function getCalloutMarginLeft(column: number, queryLength: number): number {
  const MIN_MARGIN = 2.5
  const MAX_MARGIN = 40

  // 1. 基础 margin：随 column 线性增长
  let margin = column * 0.58 - 3.2

  // 2. queryLength 的负向影响（关键：受 column 调制）
  // column 小时影响很小，column 大时影响明显
  const columnFactor = Math.max(0, (column - 12) / 45) // column < 12 时几乎无影响
  const lengthAdjustment = queryLength * 0.62 * columnFactor

  margin -= lengthAdjustment

  // 3. 边界平滑限制
  margin = Math.max(MIN_MARGIN, margin)
  margin = Math.min(MAX_MARGIN, margin)

  return Math.round(margin * 10) / 10 // 保留一位小数，适合 CodeHike
}

export default function Page() {
  const [column, setColumn] = React.useState([3])
  const [queryLength, setQueryLength] = React.useState([8])

  const marginByQueryLength = getMarginByQueryLength(queryLength[0])
  const marginByColumn = getMarginByColumn(column[0])

  const margin = marginByQueryLength + marginByColumn
  const marginLeft = getCalloutMarginLeft(column[0], queryLength[0])

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>测试页面</CardTitle>
      </CardHeader>
      <CardContent>
        <label className="block">
          <span>column</span>
          <Slider
            defaultValue={[75]}
            value={column}
            onValueChange={setColumn}
            min={1}
            max={80}
            step={1}
            className="mx-auto w-full max-w-xs"
          />
          <span>{column}</span>
        </label>
        <label className="block">
          <span>queryLength</span>
          <Slider
            defaultValue={[42]}
            value={queryLength}
            onValueChange={setQueryLength}
            min={4}
            max={256}
            step={1}
            className="mx-auto w-full max-w-xs"
          />
          <span>{queryLength}</span>
        </label>
        <pre>
          {JSON.stringify(
            {
              column,
              queryLength,
              marginByQueryLength,
              marginByColumn,
              margin,
              marginLeft,
            },
            undefined,
            2,
          )}
        </pre>

        <ul>
          {Array(0)
            .fill(null)
            .map((_, index) => {
              return (
                <li key={index}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Inventore eveniet, nisi, consequatur possimus incidunt
                  quisquam similique tenetur maiores accusantium fugiat magnam
                  sed, eaque veniam quo? Nulla exercitationem ad id quisquam
                  porro, ipsum voluptate, fuga dicta architecto est, voluptas
                  eaque repellat nisi fugiat!
                </li>
              )
            })}
        </ul>
      </CardContent>
    </Card>
  )
}
