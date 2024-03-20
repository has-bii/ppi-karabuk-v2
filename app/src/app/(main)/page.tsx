import Navbar from "@/components/navbar/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { faCheck, faGraduationCap, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const revalidate = 0

export default async function Page() {
  const supabase = createSupabaseServiceRole()

  const { count: totalUsers, data } = await supabase
    .from("profiles")
    .select("name,isActive,user_role(role)", { count: "exact" })

  const totalStudent = data?.filter((item) => item.user_role?.role?.includes("STUDENT")).length
  const activeStudent = data?.filter(
    (item) => item.isActive && item.user_role?.role?.includes("STUDENT")
  ).length

  return (
    <>
      <Navbar />
      <div className="space-y-4 p-4 lg:p-8 ">
        <h3 className="heading-3">Dashboard</h3>
        <div className="flex snap-x flex-row gap-2 overflow-x-auto scrollbar-none">
          {/* Total users */}
          <Card className="w-full min-w-[300px] snap-end">
            <CardHeader>
              <CardTitle className="inline-flex items-center justify-between gap-8 whitespace-nowrap text-lg font-medium">
                Users
                <FontAwesomeIcon icon={faUsers} className="text-muted-foreground" size="sm" />
              </CardTitle>
              <CardContent className="p-0 pt-6">
                <span className="text-5xl font-bold">{totalUsers}</span>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Total student */}
          <Card className="w-full min-w-[300px] snap-end">
            <CardHeader>
              <CardTitle className="inline-flex items-center justify-between gap-8 whitespace-nowrap text-lg font-medium">
                Students
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="text-muted-foreground"
                  size="sm"
                />
              </CardTitle>
              <CardContent className="p-0 pt-6">
                <span className="text-5xl font-bold">{totalStudent}</span>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Active student */}
          <Card className="w-full min-w-[300px] snap-end">
            <CardHeader>
              <CardTitle className="inline-flex items-center justify-between gap-8 whitespace-nowrap text-lg font-medium">
                Active Students
                <FontAwesomeIcon icon={faCheck} className="text-muted-foreground" size="sm" />
              </CardTitle>
              <CardContent className="p-0 pt-6">
                <span className="text-5xl font-bold">{activeStudent}</span>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}
