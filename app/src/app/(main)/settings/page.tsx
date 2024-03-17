"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useUserProfileQuery from "@/hooks/user-profile/useUserProfileQuery"
import dummypp from "@/assets/images/dummy-pp.png"
import Image from "next/image"
import { ChangeImage } from "@/components/settings/change-image/ChangeImage"
import Role from "@/components/user/Role"
import ChangeDetails from "@/components/settings/change-details"
import ChangePassword from "@/components/settings/change-password"
import { getImageFromS3 } from "@/utils/S3"

export default function Page() {
  const { data: profile, isLoading, isError } = useUserProfileQuery()

  if (isLoading || isError || !profile) return ""

  return (
    <div className="flex flex-wrap gap-8 pb-20">
      {/* Profile */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-col-reverse gap-4 lg:w-fit lg:flex-row lg:gap-6">
            <div>
              <div className="relative z-0 aspect-square w-full overflow-hidden rounded-md bg-[#1D1D1D] lg:w-64">
                <Image
                  alt=""
                  src={profile.image ? getImageFromS3(profile.image, "profiles") : dummypp}
                  fill
                  sizes="33vw"
                  quality={100}
                  className="object-cover"
                  priority
                />
              </div>
              <ChangeImage profile={profile} />
            </div>

            <div className="flex flex-col gap-4">
              {/* Full name */}
              <div>
                <span className="text-muted-foreground">Full Name</span>
                <span className="block capitalize">{profile.name || "-"}</span>
              </div>

              {/* Email */}
              <div>
                <span className="text-muted-foreground">Email</span>
                <span className="block lowercase">{profile.email}</span>
              </div>

              {/* Status */}
              <div>
                <span className="text-muted-foreground">Status</span>
                <span className="block capitalize">{profile.isActive ? "Active" : "Inactive"}</span>
              </div>

              {/* Role */}
              <div>
                <span className="text-muted-foreground">Role</span>
                <div className="block">
                  <div className="inline-flex gap-2 text-xs capitalize">
                    <Role role={profile.user_role.role} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit */}
      <ChangeDetails email={profile.email} name={profile.name} userId={profile.id} />

      {/* Change Password */}
      <ChangePassword />
    </div>
  )
}
