"use client"

import Modal from "@/components/Modal"
import { Dispatch, SetStateAction, useState } from "react"
import MenuState from "./MenuState"
import ChangingState from "./ChangingState"
import RemoveState from "./RemoveState"

type Props = {
  userImage: string | null
  modal: boolean
  setModal: Dispatch<SetStateAction<boolean>>
}

export default function ChangeImage({ userImage, modal, setModal }: Props) {
  const [location, setLocation] = useState<"MENU" | "CHANGE" | "REMOVE">("MENU")

  return (
    <Modal title="change profile image" show={modal} setShow={setModal}>
      {location === "MENU" && <MenuState userImage={userImage} setLocation={setLocation} />}
      {location === "CHANGE" && <ChangingState setLocation={setLocation} />}
      {location === "REMOVE" && <RemoveState setLocation={setLocation} />}
    </Modal>
  )
}
