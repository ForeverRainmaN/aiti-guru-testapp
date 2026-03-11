import { type UseMutationResult } from "@tanstack/react-query"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label
} from "@/shared/ui"

import { type AuthResponse, type LoginCredentials } from "../model"

type LoginFormFieldsProps = {
  form: UseFormReturn<LoginCredentials>
  mutation: UseMutationResult<AuthResponse, Error, LoginCredentials>
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}

export function LoginFormFields({
  form,
  mutation,
  showPassword,
  setShowPassword
}: LoginFormFieldsProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-6"
      >
        <fieldset className="space-y-6 border-0 p-0">
          <legend className="sr-only">Учётные данные</legend>

          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="username" className="text-lg font-medium text-gray-900">
                  Логин
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="username"
                      type="text"
                      inputMode="email"
                      placeholder="test@gmail.com"
                      className="border-gray-border h-12 rounded-xl border bg-white py-3 pr-4 pl-10 text-lg placeholder:text-gray-400"
                      {...field}
                    />
                  </div>
                </FormControl>
                <div className="min-h-5">
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="password" className="text-lg font-medium text-gray-900">
                  Пароль
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••••••"
                      className="border-gray-border h-12 rounded-xl border bg-white py-3 pr-12 pl-10 text-lg placeholder:text-gray-400"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-primary-dark absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-400"
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </button>
                  </div>
                </FormControl>
                <div className="min-h-5">
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              </FormItem>
            )}
          />
        </fieldset>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={form.watch("remember")}
            onCheckedChange={(checked) => form.setValue("remember", checked === true)}
            className="data-[state=checked]:border-primary data-[state=checked]:bg-primary border-gray-border h-5 w-5 rounded border-2"
            aria-label="Запомнить меня"
          />
          <Label htmlFor="remember" className="text-gray-label text-base">
            Запомнить данные
          </Label>
        </div>

        {form.formState.errors.root && (
          <div role="alert" aria-live="polite" className="text-center text-sm text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="border-primary-light bg-primary hover:bg-primary-dark focus:ring-primary-light h-12 w-full rounded-xl border text-lg font-semibold text-white shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          aria-label={mutation.isPending ? "Вход..." : "Войти"}
        >
          {mutation.isPending ? "Вход..." : "Войти"}
        </Button>

        <div className="flex items-center gap-3">
          <div className="bg-gray-border h-px flex-1" />
          <span className="text-gray-soft text-sm" aria-hidden="true">
            или
          </span>
          <div className="bg-gray-border h-px flex-1" />
        </div>

        <p className="text-gray-label text-center">
          Нет аккаунта?{" "}
          <a
            href="#"
            className="hover:text-primary-dark inline-block underline transition-transform duration-200 hover:scale-103"
            aria-label="Создать новый аккаунт"
          >
            Создать
          </a>
        </p>
      </form>
    </Form>
  )
}
