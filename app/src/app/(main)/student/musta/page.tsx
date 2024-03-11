import GiveVote from "@/components/student/musta/GiveVote"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Votes from "@/components/vote/Votes"
import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Musta, MustaFile, MustaVote, MustaVoteCandidate, MustaVoters, User } from "@/types/model"
import { redirect } from "next/navigation"

export const revalidate = 0

export type MustaData = Musta & {
  musta_file: MustaFile[]
} & {
  musta_vote: (MustaVote & {
    musta_vote_register_candidate: (MustaVoteCandidate & {
      user: User | null
      musta_voters: MustaVoters[]
    })[]
  } & {
    musta_voters: MustaVoters[]
  })[]
}

async function fetchData(): Promise<MustaData | null> {
  const supabase = createSupabaseServiceRole()

  const currentYear = new Date().getFullYear()
  const firstDayOfYear = new Date(Date.UTC(currentYear, 0, 1))

  const { data, error } = await supabase
    .from("musta")
    .select(
      `*,musta_file(*),musta_vote(*,musta_voters(*),musta_vote_register_candidate(*,musta_voters(*,musta_vote(*)),user(*)))`
    )
    .gte("created_at", firstDayOfYear.toUTCString())
    .single()

  if (error) console.error("Failed to fetch musta data by id: ", error)

  return data
}

export default async function Page() {
  const data = await fetchData()

  if (!data) redirect("/student")

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl text-foreground font-bold">{data.name}</h2>
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Musta File */}
        <Card className="">
          <CardHeader>
            <CardTitle className="font-semibold text-lg">Files</CardTitle>
            <CardDescription>You can download all the uploaded files.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl text-foreground font-bold">{data.musta_file.length}</p>
          </CardContent>
        </Card>

        {/* Musta Vote */}
        <Card className="">
          <CardHeader>
            <CardTitle className="font-semibold text-lg">Votings</CardTitle>
            <CardDescription>Number of votings have been held.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl text-foreground font-bold">{data.musta_vote.length}</p>
          </CardContent>
        </Card>

        {/* Number of votes */}
        {data.musta_vote.map((vote) => (
          <Card key={vote.id} className="">
            <CardHeader>
              <CardTitle className="font-semibold text-lg">Number of votes</CardTitle>
              <CardDescription>
                Number of voters of <span className="font-semibold">{vote.name}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-6xl text-foreground font-bold">{vote.musta_voters.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="w-full lg:w-3/4 h-full">
          <Votes dataProps={data.musta_vote} />
        </div>
        <div className="flex flex-col gap-4">
          {/* Give Vote */}
          <GiveVote mustaData={data} />
        </div>
      </div>
    </div>
  )

  // return <MustaById dataProps={data} />
}
