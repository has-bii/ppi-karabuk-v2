import { MustaData } from "@/app/(main)/student/musta/page"
import { useSupabaseClient } from "@/hook/supabase"
import React, { useEffect, useState } from "react"
// import BarChart from "../chart/BarChart"
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

type Props = {
  musta_vote: MustaData["musta_vote"][0]
}

export default function Chart({ musta_vote }: Props) {
  const [data, setData] = useState<Props["musta_vote"]["musta_voters"]>(musta_vote.musta_voters)
  const [candidates, setCandidates] = useState<{ name: string; id: string }[]>(
    musta_vote.musta_vote_register_candidate.map((item) => {
      return { name: item.user?.name || "No name", id: item.id }
    })
  )
  const [dataSet, setDataSet] = useState<{ name: string; value: number; id: string }[]>(
    candidates.map((candidate) => {
      return {
        name: candidate.name,
        value: data.filter((item) => item.musta_vote_register_candidate_id === candidate.id).length,
        id: candidate.id,
      }
    })
  )
  const supabase = useSupabaseClient()

  useEffect(() => {
    const channel = supabase
      .channel(musta_vote.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "musta_voters",
        },
        (payload) => {
          if (payload.new) {
            if (payload.new.musta_vote_id === musta_vote.id) {
              const temp = dataSet.find(
                (item) => item.id === payload.new.musta_vote_register_candidate_id
              )

              if (!temp) return

              setDataSet((prev) =>
                prev.map((item) => {
                  if (item.id === payload.new.musta_vote_register_candidate_id) {
                    item.value++
                  }

                  return item
                })
              )
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={500}
        data={dataSet}
        margin={{
          top: 20,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" className="fill-foreground" />
      </BarChart>
    </ResponsiveContainer>
  )
}
