import axios from "axios"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import { z } from "zod"

import { validateWithZod } from "./zod-validator"

/**
 * Создаёт TaskEither для API-запроса с валидацией ответа
 * @param requestFn - функция, возвращающая Promise с сырыми данными
 * @param schema - Zod-схема для валидации ответа
 * @param mapError - опциональная функция для преобразования ошибок, возвращает Option<Error>
 */

export const createApiRequest = <A>(
  promise: Promise<unknown>,
  schema: z.ZodSchema<A>,
  mapError?: ErrorMapper
): TE.TaskEither<Error, A> => {
  return pipe(
    TE.tryCatch(
      () => promise,
      (error) => handleRequestError(error, mapError)
    ),
    TE.chain((data) => validateResponse(data, schema))
  )
}

// errors

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NetworkError"
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export type ErrorMapper = (error: unknown) => O.Option<Error>

// helpers

const handleRequestError = (error: unknown, mapError?: ErrorMapper): Error => {
  if (mapError) {
    const maybeError = mapError(error)
    if (O.isSome(maybeError)) {
      return maybeError.value
    }
  }
  if (axios.isAxiosError(error)) {
    return new NetworkError(error.message)
  }
  return new Error("Unknown error")
}

const validateResponse = <A>(
  data: unknown,
  schema: z.ZodSchema<A>
): TE.TaskEither<ValidationError, A> =>
  pipe(
    validateWithZod(schema)(data),
    E.mapLeft((validationError) => new ValidationError(validationError.message)),
    TE.fromEither
  )

// Преобразует TaskEither в Promise для использования в React Query

export const toPromise = <A>(task: TE.TaskEither<Error, A>): Promise<A> =>
  task().then(
    E.fold(
      (error) => Promise.reject(error),
      (data) => Promise.resolve(data)
    )
  )
