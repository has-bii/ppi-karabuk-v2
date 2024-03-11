import { Database } from "./database"

export type Musta = Database["public"]["Tables"]["musta"]["Row"]

export type MustaFile = Database["public"]["Tables"]["musta_file"]["Row"]

export type MustaVote = Database["public"]["Tables"]["musta_vote"]["Row"]

export type MustaVoteCandidate =
  Database["public"]["Tables"]["musta_vote_register_candidate"]["Row"]

export type MustaVoters = Database["public"]["Tables"]["musta_voters"]["Row"]

export type User = Database["public"]["Tables"]["user"]["Row"]
