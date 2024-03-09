import Footer from "@/components/LandingPage/Footer"
import Nav from "@/components/LandingPage/Nav"

export default function LandingPageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {children}

      <Footer />
    </main>
  )
}
