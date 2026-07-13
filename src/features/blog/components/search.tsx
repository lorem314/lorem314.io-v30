"use client"

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardAction,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext } from "./context"

export const Search = () => {
  const { searchTerm, onSearchTermChange } = useContext()

  return (
    <Card className="col-span-full lg:col-span-6">
      <CardHeader>
        <CardTitle>
          <Label htmlFor="blog-search">搜索</Label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          id="blog-search"
          className="py-5"
          type="search"
          value={searchTerm}
          onChange={(event) => {
            onSearchTermChange(event.target.value)
          }}
        />
      </CardContent>
    </Card>
  )
}
