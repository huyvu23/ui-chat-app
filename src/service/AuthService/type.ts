export type TUser = {
  id: number
  username: string
  createdAt: string
}

export type TFormLogin = {
  username: string
  password: string
}

type TAccessToken = {
  accessToken: string
}

export type TResponseLogin = TUser & TAccessToken
