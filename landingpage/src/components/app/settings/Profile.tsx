"use client"

import { useToast } from "@/context/ToastContext"
import { useState } from "react"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faImage } from "@fortawesome/free-solid-svg-icons"
import sendEmailVerification from "@/service/App/settings/profile/sendEmailVerification"
import updateUserData from "@/service/App/settings/profile/updateUserData"
import ChangeImage from "@/components/app/settings/ChangeImage/ChangeImage"
import Link from "next/link"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { UserData } from "@/service/App/settings/profile/getUserData"
import PageWrapper from "../PageWrapper"
import UserRole from "../UserRole"
import navSideSettings from "@/app/app/settings/navSideSettings"

export default function Profile({ userData }: { userData: UserData }) {
  const [data, setData] = useState<UserData>(userData)
  const [form, setForm] = useState<UserData>(userData)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)
  const { pushToast } = useToast()

  // Send verification email
  function sendVerEmail(id: string, email: string) {
    pushToast("Sending verification email...", "normal")
    sendEmailVerification(id, email).then((res) => {
      pushToast(res.message, res.status)
    })
  }

  // Update Record
  function updateData() {
    setUpdateLoading(true)
    updateUserData({
      name: form.name,
      email: form.email,
    })
      .then((res) => {
        pushToast(res.message, res.status)

        if (res.status === "success") {
          let temp: UserData = JSON.parse(JSON.stringify(form))

          if (data.email !== form.email) {
            temp.emailVerified = null
          }
          setData(temp)
          setForm(temp)
        }
      })
      .catch(() => {
        pushToast("Internal server error", "error")
      })
      .finally(() => setUpdateLoading(false))
  }

  return (
    <>
      <ChangeImage userImage={data.image} modal={modal} setModal={setModal} />

      <PageWrapper url="/settings" navSideItems={navSideSettings}>
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 p-4 lg:p-8 border rounded-lg">
          {/* Image */}
          <div className="flex flex-col w-full lg:w-fit gap-2 items-center">
            <div className="relative overflow-hidden rounded-md aspect-square w-full lg:w-48 bg-black">
              <Image
                src={data.image ? getFileServiceURL(data.image) : dummy}
                fill
                className="object-cover"
                sizes="30vw"
                quality={100}
                priority
                alt=""
              />
            </div>
            <button
              className="inline-flex items-center gap-2 text-sky-400 w-fit capitalize"
              onClick={() => setModal(true)}
            >
              <FontAwesomeIcon icon={faImage} size="lg" />
              change image
            </button>
          </div>

          {/* Profile */}
          <div className="flex flex-col gap-2 w-full">
            {/* Name */}
            <div>
              <span className="capitalize text-neutral-400">full name</span>
              <input
                type="text"
                className="block text-lg capitalize w-full"
                value={data.name}
                readOnly
              />
            </div>
            {/* Email */}
            <div>
              <span className="capitalize text-neutral-400">email address</span>
              <input
                type="text"
                className="block text-lg lowercase w-full"
                value={data.email}
                readOnly
              />
            </div>
            {/* status */}
            <div>
              <span className="capitalize text-neutral-400">status</span>
              <div className="w-full inline-flex gap-4">
                {!data.isActive ? (
                  <>
                    <span className="text-lg capitalize">inactive</span>
                    <Link
                      href="/app/settings/activate"
                      className="bg-white px-2 py-1 border rounded-full text-sm hover:bg-black hover:text-white"
                    >
                      Send Request
                    </Link>
                  </>
                ) : (
                  <span className="text-lg capitalize">active</span>
                )}
              </div>
            </div>
            {/* Roles */}
            <div>
              <span className="capitalize text-neutral-400">role</span>
              <div className="block mt-1">
                <UserRole role={data.role} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="border p-4 lg:p-8 rounded-lg mt-4 lg:mt-8">
          <h6 className="text-xl text-neutral-800 font-semibold capitalize mb-4">edit profile</h6>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="name" className="capitalize text-neutral-400">
                full name
              </label>
              <input
                type="text"
                id="name"
                className="block text-lg capitalize w-full border rounded-md px-3 py-1.5 mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="capitalize text-neutral-400 block">
                email address
              </label>
              <div className="inline-flex gap-2 w-full items-center">
                <input
                  type="text"
                  id="email"
                  className="block text-lg lowercase border rounded-md px-3 py-1.5 mt-1 w-full"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {form.emailVerified === null && (
                  <button
                    className="capitalize px-3 py-1.5 rounded-md bg-black text-white text-lg"
                    onClick={() => sendVerEmail(data.id, form.email)}
                    disabled={form.email !== data.email}
                  >
                    send
                  </button>
                )}
              </div>
              {form.emailVerified === null ? (
                <div className="pl-2 text-sm text-red-400 truncate">
                  Your email is not verified. Send the verification email.
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="w-full flex">
          <button
            className="px-4 py-2 bg-black rounded-md text-white ml-auto capitalize mt-4 disabled:bg-neutral-200 disabled:text-neutral-600 inline-flex gap-2 items-center"
            disabled={JSON.stringify(data) === JSON.stringify(form) || updateLoading}
            onClick={updateData}
          >
            <span>save changes</span>
            {updateLoading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
          </button>
        </div>
      </PageWrapper>
    </>
  )
}
