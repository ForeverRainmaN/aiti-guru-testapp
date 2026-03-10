import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"

const TOKEN_KEY = "accessToken"

export const saveToken = (token: string, remember: boolean): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    async () => {
      const storage = remember ? localStorage : sessionStorage
      storage.setItem(TOKEN_KEY, token)
    },
    (reason) => new Error(`Failed to save token: ${reason}`)
  )

export const getToken = (): O.Option<string> =>
  O.fromNullable(localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY))

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
