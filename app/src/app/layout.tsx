import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/provider/Providers"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import "../styles/globals.css"
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
