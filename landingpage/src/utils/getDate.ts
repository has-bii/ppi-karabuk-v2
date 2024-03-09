export default function getDate(dateString: string): string {
  const newDate = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  const formattedDate: string = newDate.toLocaleDateString("id-ID", options)

  return formattedDate
}
