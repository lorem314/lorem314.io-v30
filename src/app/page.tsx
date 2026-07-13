import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>主页</CardTitle>
      </CardHeader>
      <CardContent>欢迎来到我的博客</CardContent>
    </Card>
  )
}
