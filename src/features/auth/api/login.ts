import { validateWithZod } from "@/shared"
import axios, { AxiosError } from "axios"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { AuthResponseSchema, type AuthResponse } from "../model/schema"
import { AuthError, NetworkError, ValidationError, type LoginCredentials } from "../model/types"

const loginRequest = (credentials: LoginCredentials): Promise<unknown> =>
  axios
    .post(
      "https://dummyjson.com/auth/login",
      {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 30
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data)

const loginTask = (credentials: LoginCredentials): TE.TaskEither<Error, AuthResponse> =>
  pipe(
    TE.tryCatch(
      () => loginRequest(credentials),
      (error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError
          if (axiosError.response?.status === 400 || axiosError.response?.status === 401) {
            return new AuthError("Incorrect login or password")
          }
          return new NetworkError(axiosError.message)
        }
        return new Error("Unknown error")
      }
    ),
    TE.chain((data) =>
      pipe(
        validateWithZod(AuthResponseSchema)(data),
        E.mapLeft((error) => new ValidationError(error.message)),
        TE.fromEither
      )
    )
  )

export const login = (credentials: LoginCredentials): Promise<AuthResponse> =>
  loginTask(credentials)().then((either) => {
    if (either._tag === "Right") {
      return either.right
    } else {
      throw either.left
    }
  })
