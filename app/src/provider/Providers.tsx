// app/providers.tsx
"use client"

import { ReactQueryClientProvider } from "@/provider/ReactQueryClientProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
    </ReactQueryClientProvider>
  )
}
