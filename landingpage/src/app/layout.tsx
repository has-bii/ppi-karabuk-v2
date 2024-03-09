import ReactQueryProvider from "@/provider/ReactQueryProvider"
import { config } from "@fortawesome/fontawesome-svg-core"
import { ToastProvider } from "@/provider/ToastProvider"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import "@/styles/globals.css"
config.autoAddCss = false

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PPI Karabuk",
  description:
    "PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük untuk membina anggota, pendalaman etika, ilmu, akselerasi potensi diri dan penyaluran aspirasi.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
