"use client"

import { useRef, useState } from "react"

type Props = {
  thumbnail_url: string
  media_url: string
}

export default function Video({ thumbnail_url, media_url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pause, setPause] = useState<boolean>(true)

  function controlVideo() {
    if (videoRef.current?.paused) {
      videoRef.current.play()
      setPause(false)
    } else {
      videoRef.current?.pause()
      setPause(true)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        poster={thumbnail_url}
        className="absolute top-1/2 left-0 -translate-y-1/2"
        muted={pause}
      >
        <source src={media_url} type="video/mp4" />
      </video>
      <button
        className="absolute top-2 right-2 text-white font-semibold text-lg"
        onClick={controlVideo}
      >
        {pause ? "play" : "pause"}
      </button>
    </>
  )
}
