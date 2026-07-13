import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { CodeSandbox } from "@/components/sandpack/code-sandbox"

export default async function Page() {
  return (
    <Card className="mx-auto w-full max-w-2xl overflow-visible">
      <CardHeader>
        <CardTitle>Sandpack 测试页面</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeSandbox
          folder="0-test-react-ts"
          template="react-ts"
          title="抽屉组件沙盒"
          files={{
            "/App.tsx": true,
            "/components/custom-comp.tsx": true,
          }}
          options={{
            activeFile: "/App.tsx",
            visibleFiles: ["/App.tsx"],
          }}
          customSetup={{
            dependencies: {
              react: "19.1.0", // 或者 "19.2.0"，选一个稳定版本
              "react-dom": "19.1.0", // 必须和上面完全一样
            },
            devDependencies: {
              "@types/react": "^19.1.0",
              "@types/react-dom": "^19.1.0",
            },
          }}
          previewHeight="500px"
        />
        {/* <CodeSandbox
          folder="0-test-react-ts"
          files={{
            "/App.tsx": "/App.preview.tsx",
            "/components/custom-comp.tsx": true,
          }}
        /> */}
      </CardContent>
    </Card>
  )
}
