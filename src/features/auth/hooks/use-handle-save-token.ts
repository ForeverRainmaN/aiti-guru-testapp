import { useNavigate } from "@tanstack/react-router"
import { pipe } from "fp-ts/function"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import { toast } from "sonner"
import { saveToken } from "../model"

export const useHandleSaveToken = () => {
  const navigate = useNavigate()

  return (token: string, remember: boolean) =>
    pipe(
      saveToken(token, remember),
      TE.fold(
        (error) => {
          toast.error("Не удалось сохранить токен")
          console.error(error)
          return T.of(undefined)
        },
        () => {
          toast.success("Вход выполнен успешно")
          navigate({ to: "/products" })
          return T.of(undefined)
        }
      )
    )()
}
