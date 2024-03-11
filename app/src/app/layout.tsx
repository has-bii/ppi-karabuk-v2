import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { Providers } from "@/provider/Providers"
import { Inter as FontSans } from "next/font/google"
import type { Metadata } from "next"
import "../styles/globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
config.autoAddCss = false

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "App | PPI Karabuk ",
  description: "Official platform for Indonesian Students in Karabuk, Turkiye.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn("min-h-dvh bg-background font-sans antialiased", fontSans.variable)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
