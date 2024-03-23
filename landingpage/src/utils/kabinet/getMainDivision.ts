import { Division } from "@/types/kabinet"

export function getMainDivision(typeDivision: Division["type"], division: Division[]) {
  if (typeDivision !== "divisi") {
    const data = division.find((item) => item.type === typeDivision)

    if (!data) return null

    return {
      name: data.name,
      ketua: data.division_user.find((user) => user.division_user_type === "ketua") || null,
      anggota: data.division_user.filter((user) => user.division_user_type !== "ketua"),
    }
  }

  return null
}

export function getDivisions(division: Division[]) {
  return division
    .filter((item) => item.type === "divisi")
    .map((divisi) => {
      return {
        name: divisi.name,
        ketua: divisi.division_user.find((user) => user.division_user_type === "ketua") || null,
        anggota: divisi.division_user.filter((user) => user.division_user_type !== "ketua"),
      }
    })
}
