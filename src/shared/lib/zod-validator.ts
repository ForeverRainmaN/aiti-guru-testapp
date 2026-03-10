import * as E from "fp-ts/Either"
import { z } from "zod"

export const validateWithZod =
  <A>(schema: z.ZodSchema<A>) =>
  (data: unknown): E.Either<Error, A> => {
    const result = schema.safeParse(data)
    return result.success
      ? E.right(result.data)
      : E.left(new Error(`Validation error: ${result.error.message}`))
  }
