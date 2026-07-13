import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { highlight, Pre } from "codehike/code"
import { CodeViewer } from "@/components/codehike/code-viewer"
import { CodeViewerWithTabs } from "@/components/codehike/code-with-tabs"

export default async function Page() {
  const highlighted = await highlight(
    {
      lang: "tsx",
      value: "import React from 'react'\nconst fn = ()=>{ return <div></div>}",
      meta: "",
    },
    "github-dark",
  )
  return (
    <Card className="mx-auto w-full max-w-2xl overflow-visible">
      <CardHeader>
        <CardTitle>CodeHike 测试页面</CardTitle>
      </CardHeader>
      <CardContent>
        CodeHike 测试页面内容
        {/* <CodeViewerWithTabs
          files={[
            {
              path: "/content/sandbox/0-test-react-ts/App.tsx",
              title: "npm",
              meta: "showCopyButton",
            },
            {
              path: "/content/sandbox/0-test-react-ts/App.preview.tsx",
              title: "yarn",
            },
          ]}
        /> */}
        {/* <Pre code={highlighted} style={highlighted.style} /> */}
        <CodeViewer
          file="/content/sandbox/0-test-react-ts/App.tsx"
          title="/content/sandbox/0-test-react-ts/App.tsx"
          showCopyButton
          showLineNumbers
          // collapsible
          // collapseToLine={10}
        />
      </CardContent>
    </Card>
  )
}
