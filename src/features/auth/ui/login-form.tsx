import { login } from "@/features/auth/api"
import { useHandleSaveToken } from "@/features/auth/hooks"
import { AuthError, loginSchema, NetworkError, type LoginCredentials } from "@/features/auth/model"
import { LoginFormFields } from "@/features/auth/ui/login-form-fields"
import { Card } from "@/shared/ui"
import { Logo } from "@/shared/ui/logo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function LoginForm() {
  const handleSaveToken = useHandleSaveToken()
  const [showPassword, setShowPassword] = useState(false)

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
    onSuccess: (data, variables) => handleSaveToken(data.accessToken, variables.remember),
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

  return (
    <Card className="border-gray-border mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border bg-gradient-to-b from-black/5 to-transparent p-8 shadow-lg">
      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Добро пожаловать!</h1>
        <p className="text-gray-soft mt-2 text-lg">Пожалуйста, авторизируйтесь</p>
      </div>

      <LoginFormFields
        form={form}
        mutation={mutation}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </Card>
  )
}
