"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MustaData } from "@/app/(main)/student/musta/page"
import dummypp from "@/assets/images/dummy-pp.png"
import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import { getImageFromS3 } from "@/utils/S3"
import { useSupabaseClient } from "@/hook/supabase"
import { useToast } from "@/context/ToastContext"
import { Button } from "@/components/ui/button"
import { User } from "@supabase/supabase-js"

type Props = {
  mustaData: MustaData
}

export default function GiveVote({ mustaData }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const supabase = useSupabaseClient()
  const { pushToast } = useToast()

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (res.data.user) setUser(res.data.user)
      else pushToast("Failed to fetch user session!", "error")
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const voteHandler = async (musta_vote_register_candidate_id: string, musta_vote_id: string) => {
    pushToast("Giving a vote... ", "normal")

    const check = await supabase
      .from("musta_voters")
      .select(`*`, { count: "exact", head: true })
      .eq("user_id", user?.id!)
      .eq("musta_vote_id", musta_vote_id)

    if (check.count) {
      pushToast("You have already voted!", "error")
      return
    }

    const { error } = await supabase
      .from("musta_voters")
      .insert({ musta_vote_register_candidate_id, musta_vote_id })

    if (error) pushToast(error.message, "error")
    else pushToast("Voted successfully", "success")
  }

  return (
    <>
      {mustaData.musta_vote.map((vote) => (
        <Card key={vote.id} className="w-full">
          <CardHeader>
            <CardTitle className="font-semibold text-lg capitalize">{vote.name}</CardTitle>
            <CardDescription>You can give a vote for each one.</CardDescription>
          </CardHeader>
          <CardContent className="flex-col flex gap-2 w-full">
            {vote.musta_vote_register_candidate.length !== 0 ? (
              vote.musta_vote_register_candidate.map((candidate) => (
                <div key={candidate.id} className="inline-flex gap-2 items-center w-full">
                  {/* Photo Profile */}
                  <div className="relative w-10 aspect-square rounded-full overflow-hidden">
                    <Image
                      alt=""
                      src={
                        candidate.user?.image
                          ? getImageFromS3(candidate.user.image, "profiles")
                          : dummypp
                      }
                      fill
                      priority
                      sizes="26vw"
                      className="object-cover"
                    />
                  </div>

                  <span className="text-foreground capitalize truncate">
                    {candidate.user?.name || "No Name"}
                  </span>
                  <Button
                    size="sm"
                    className="ml-auto"
                    onClick={() => voteHandler(candidate.id, candidate.musta_vote_id)}
                  >
                    Vote
                  </Button>
                </div>
              ))
            ) : (
              <div className="relative w-full overflow-hidden rounded-md">
                <span className="font-bold text-3xl">There is no candidate.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}
