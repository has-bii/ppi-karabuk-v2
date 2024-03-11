"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { MustaData } from "@/app/(main)/student/musta/page"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import Chart from "./Chart"

type Props = {
  dataProps: MustaData["musta_vote"]
}

export default function Votes({ dataProps }: Props) {
  const [mustaVotes, setMustaVotes] = useState<MustaData["musta_vote"]>(dataProps)
  const [selectMusta, setSelectMusta] = useState<MustaData["musta_vote"][0] | null>(null)
  const [selectedVoting, setSelectedVoting] = useState<string>()
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="inline-flex w-full justify-between items-center">
          <span className="font-semibold text-lg">See Votings</span>
          <Select
            value={selectedVoting}
            onValueChange={(value) => {
              setSelectedVoting(value)
              setSelectMusta(mustaVotes.find((item) => item.id === value) || null)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a voting...">
                {mustaVotes.find((item) => item.id === selectedVoting)?.name || null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {mustaVotes.map((mustaVote) => (
                  <SelectItem key={mustaVote.id} value={mustaVote.id} className="capitalize">
                    {mustaVote.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="h-[30rem] flex justify-center items-center">
        {selectedVoting && selectMusta ? (
          <Chart musta_vote={selectMusta} />
        ) : (
          <span>No voting selected.</span>
        )}
      </CardContent>
    </Card>
  )
}
