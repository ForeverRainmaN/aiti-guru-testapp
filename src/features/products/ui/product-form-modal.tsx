import { zodResolver } from "@hookform/resolvers/zod"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"

import { ProductFormSchema, type Product, type ProductFormData } from "../model/schema"

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData: O.Option<Product>
  onSave: (data: ProductFormData, id?: number) => void
}

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSave
}: ProductFormModalProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: "",
      price: 0,
      brand: "",
      sku: ""
    }
  })

  useEffect(() => {
    if (open) {
      pipe(
        initialData,
        O.fold(
          () => form.reset({ title: "", price: 0, brand: "", sku: "" }),
          (product) =>
            form.reset({
              title: product.title,
              price: product.price,
              brand: product.brand ?? "",
              sku: product.sku ?? ""
            })
        )
      )
      form.clearErrors()
    }
  }, [open, initialData, form])

  const onSubmit = (values: ProductFormData) => {
    const cleanedData = {
      ...values,
      brand: values.brand || undefined,
      sku: values.sku || undefined
    }
    const id = pipe(
      initialData,
      O.fold(
        () => undefined,
        (product) => product.id
      )
    )
    onSave(cleanedData, id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Добавить товар" : "Редактировать товар"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Наименование</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Цена</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : parseFloat(value))
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Вендор</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Бренд"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Артикул</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Необязательно"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <div className="mt-2 flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit">{mode === "add" ? "Добавить" : "Сохранить"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
