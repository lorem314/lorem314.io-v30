import { Metadata } from "next"
import Link from "next/link"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <nav>
        <ul>
          {[
            { title: "Sandpack", href: "/test/sandpack" },
            { title: "CodeHike", href: "/test/codehike" },
          ].map((item, index) => {
            return (
              <li key={index}>
                <Link href={item.href}>{item.title}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div>{children}</div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "测试页面 - lorem314.io",
}
