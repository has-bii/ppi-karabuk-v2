"use client"

import createSupabaseClient from "@/lib/supabase/client"
import { useToast } from "@/context/ToastContext"
import { UserProfile } from "@/utils/user"
import { useEffect, useState } from "react"
import Image from "next/image"
import dummypp from "@/assets/images/dummy-pp.png"
import { User } from "@supabase/supabase-js"
import Role from "@/components/user/Role"
import { getImageFromS3 } from "@/utils/S3"
import { ChangeImage } from "@/components/settings/change-image/ChangeImage"
import ChangePassword from "@/components/settings/change-password"
import ChangeDetails from "@/components/settings/change-details"

export default function Page() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createSupabaseClient()
  const { pushToast } = useToast()

  // useEffect(() => {
  //   supabase
  //     .from("user")
  //     .select(`*`)
  //     .single()
  //     .then(({ data, error }) => {
  //       if (data) setUserProfile(data)

  //       if (error) pushToast("Failed to fetch User Profile!", "error")
  //     })

  //   supabase.auth.getUser().then(({ data, error }) => {
  //     if (data) setUser(data.user)

  //     if (error) pushToast("Failed to fetch User Data!", "error")
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div className="page flex flex-wrap gap-8">
      {/* Profiles */}
      <div className="card w-full lg:max-w-[38rem]">
        <span className="heading-2">Profiles</span>
        <div className="mt-2 flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
          <div>
            <div className="relative z-0 aspect-square w-full overflow-hidden rounded-md bg-background lg:w-64">
              {userProfile !== null ? (
                <Image
                  alt=""
                  src={userProfile.image ? getImageFromS3(userProfile.image, "profiles") : dummypp}
                  fill
                  sizes="24vw"
                  quality={100}
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="bg-default-200 h-full w-full animate-pulse" />
              )}
            </div>
            {userProfile !== null && <ChangeImage image={userProfile.image} />}
          </div>

          <div className="flex flex-col gap-4">
            {/* Full name */}
            <div>
              <span className="text-muted-foreground">Full Name</span>
              <span className="block capitalize">{userProfile?.name || "-"}</span>
            </div>

            {/* Email */}
            <div>
              <span className="text-muted-foreground">Email</span>
              <span className="block lowercase">{user?.email ? user.email : "Loading..."}</span>
            </div>

            {/* Status */}
            <div>
              <span className="text-muted-foreground">Status</span>
              <span className="block capitalize">
                {userProfile === null ? "Loading..." : userProfile.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Role */}
            <div>
              <span className="text-muted-foreground">Role</span>
              <div className="block">
                <div className="inline-flex gap-2 text-xs capitalize">
                  <Role role={userProfile?.role || []} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit */}
      <ChangeDetails
        email={user?.email || ""}
        name={userProfile?.name || ""}
        userId={user?.id || ""}
      />

      {/* Change Password */}
      <ChangePassword />
    </div>
  )
}
