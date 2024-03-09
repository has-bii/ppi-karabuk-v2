import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 md:py-6 lg:py-8 w-full mt-auto">
      <section className="container flex flex-col gap-4 items-center">
        {/* <Logo color="white" className="mb-10" /> */}
        <div className="flex flex-col md:flex-row w-full items-center md:justify-between">
          <p className="text-sm text-white/60 font-light">
            © 2023 PPI Karabük. All rights reserved.
          </p>
          <div className="inline-flex gap-2 items-center">
            <p className="text-white/60">Follow us on social media</p>
            <Link href="https://www.youtube.com/@mahasiswakarabuk6988">
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
            <Link href="https://www.instagram.com/ppikarabuk/">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  )
}
