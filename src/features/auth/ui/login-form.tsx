import { login } from "@/features/auth/api"
import { AuthError, loginSchema, NetworkError, type LoginCredentials } from "@/features/auth/model"
import { saveToken } from "@/features/auth/model/auth-storage"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label
} from "@/shared/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { pipe } from "fp-ts/function"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false
    }
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      pipe(
        saveToken(data.accessToken, variables.remember),
        TE.fold(
          (error) => {
            toast.error("Не удалось сохранить токен")
            console.error(error)
            return T.of(undefined)
          },
          () => {
            toast.success("Вход выполнен успешно")
            navigate({ to: "/" })
            return T.of(undefined)
          }
        )
      )()
    },
    onError: (error) => {
      if (error instanceof AuthError) {
        toast.error(error.message)
        form.setError("root", { message: error.message })
      } else if (error instanceof NetworkError) {
        toast.error("Ошибка сети. Проверьте подключение.")
      } else {
        toast.error("Произошла неизвестная ошибка")
      }
    }
  })

  const onSubmit = (values: LoginCredentials) => {
    mutation.mutate(values)
  }

  return (
    <Card className="shadow-card w-[527px] rounded-[40px] p-1.5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Добро пожаловать!</CardTitle>
        <p className="text-muted-foreground text-sm">Пожалуйста, авторизируйтесь!</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input placeholder="test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="***********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={form.watch("remember")}
                onCheckedChange={(checked) => form.setValue("remember", checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Запомнить данные
              </Label>
            </div>
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Нет аккаунта?{" "}
          <a href="#" className="text-primary underline">
            Создать
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
