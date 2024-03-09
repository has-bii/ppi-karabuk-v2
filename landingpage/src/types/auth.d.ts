type AuthBody = {
  name?: string
  email?: string
  studentId?: string
  kimlikId?: string
  password?: string
}

type AuthResponse<T = {}> =
  | {
      status: "success"
      message: string
    }
  | {
      status: "error"
      message: string
      error: T
    }

type AuthLoginErrorResponse = {
  email?: string
  password?: string
}

type AuthRegisterErrorResponse = {
  studentID?: string
  kimlikID?: string
}

type AuthForgotErrorResponse = {
  email?: string
}

type AuthResetErrorResponse = {
  token?: string
  password?: string
}

type AuthInput = {
  label: string
  value: string
  validation: { status: "ok" | "error" | null; text: string }
}

export {
  AuthBody,
  AuthResponse,
  AuthInput,
  AuthLoginErrorResponse,
  AuthRegisterErrorResponse,
  AuthForgotErrorResponse,
  AuthResetErrorResponse,
}
