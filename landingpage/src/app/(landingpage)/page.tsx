import { Metadata } from "next"
import HeroImage from "@/components/LandingPage/HeroImage"
import Instagram from "@/components/LandingPage/Instagram"
import Link from "next/link"
import Image from "next/image"
import Phone from "@/images/attributes/phone.png"
import LatestNews from "@/components/LandingPage/LatestNews"

export const metadata: Metadata = {
  title: "Home | PPI Karabuk",
}

export const dynamic = "force-dynamic"
export const revalidate = 3600

export default async function Home() {
  return (
    <>
      {/* Hero Start */}
      <section className="flex flex-wrap divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black lg:h-[38rem] border-b-2 border-black">
        <div className="self-center block flex-1 w-2/5 px-12 py-12 lg:py-0">
          <h1 className="mb-5 text-4xl font-light text-center lg:text-left">
            <span className="block font-extrabold text-red-900 lg:text-6xl">
              &quot;PPI Karabük&quot;
            </span>
          </h1>
          <p className="text-xl text-center lg:text-left">
            PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük untuk membina
            anggota, pendalaman etika, ilmu, akselerasi potensi diri dan penyaluran aspirasi.
          </p>
          <div className="flex justify-center gap-4 mt-4 lg:justify-start">
            <button className="button" disabled>
              Daftar kuliah
            </button>
            <button className="button btn-white" disabled>
              Tentang kami
            </button>
          </div>
        </div>

        <HeroImage />
      </section>
      {/* Hero End */}

      {/* Latest News */}
      <section className="section spacing">
        <div className="container">
          <h2 className="text-left hover:underline">
            <Link href="/article">Latest Article</Link>
          </h2>
          <LatestNews />
        </div>
      </section>

      {/* Youtube Channel */}
      <section className="relative section flex flex-col justify-center items-center spacing overflow-hidden bg-black">
        <h2 className="text-white">Youtube Channel</h2>

        <div className="flex flex-row w-full justify-center items-center">
          <Image
            src={Phone}
            width={300}
            alt=""
            priority
            quality={100}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto hidden xl:block"
          />

          <div className="aspect-video h-48 md:h-96 xl:h-[36rem] relative">
            <span className="absolute hidden xl:block w-full h-full bg-white -top-5 -right-5 xl:border-[3px] xl:border-[#000]"></span>
            <iframe
              src="https://www.youtube.com/embed/GwlJz_sn_RQ"
              title="YouTube video player"
              allowFullScreen
              className="top-0 left-0 w-full h-full absolute z-10 xl:border-[3px] xl:border-[#000]"
            ></iframe>
          </div>

          <Image
            src={Phone}
            width={300}
            alt=""
            priority
            quality={100}
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 h-auto hidden xl:block"
          />
        </div>

        <Link
          href="https://www.youtube.com/@mahasiswakarabuk6988"
          target="_blank"
          className="button btn-white w-fit btn-big font-bold mt-8"
        >
          Open Youtube
        </Link>
      </section>
      {/* Youtube end */}

      {/* Instagram Section */}
      <section className="section flex flex-col justify-center items-center spacing overflow-hidden">
        <h2>Instagram</h2>
        <Instagram />
        <Link
          href="https://www.instagram.com/ppikarabuk/"
          target="_blank"
          className="button btn-white w-fit btn-big font-bold mt-8"
        >
          Open Instagram
        </Link>
      </section>
    </>
  )
}
