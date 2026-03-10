import axios from "axios"
import * as O from "fp-ts/Option"

import { createApiRequest, toPromise, type ErrorMapper } from "@/shared/lib"

import { AuthResponseSchema, type AuthResponse } from "../model/schema"
import { AuthError, type LoginCredentials } from "../model/types"

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

const mapLoginError: ErrorMapper = (error) => {
  if (
    axios.isAxiosError(error) &&
    (error.response?.status === 400 || error.response?.status === 401)
  ) {
    return O.some(new AuthError("Incorrect login or password"))
  }
  return O.none
}

const loginTask = (credentials: LoginCredentials) =>
  createApiRequest(loginRequest(credentials), AuthResponseSchema, mapLoginError)

export const login = (credentials: LoginCredentials): Promise<AuthResponse> =>
  toPromise(loginTask(credentials))
